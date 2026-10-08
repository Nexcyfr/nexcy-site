import { test, expect, type Page } from "@playwright/test";
import { collectConsoleErrors } from "./_utils";

const VALID = {
  name: "Camille Durand",
  email: "camille@example.com",
  company: "Atelier Durand",
  message: "Nous souhaitons refondre notre site et mieux le référencer à Bordeaux.",
};

async function fillValid(page: Page) {
  await page.getByLabel("Comment vous appelez-vous ?").fill(VALID.name);
  await page.getByLabel(/adresse e-mail professionnelle/).fill(VALID.email);
  await page.getByLabel("Quelle entreprise représentez-vous ?").fill(VALID.company);
  await page.getByLabel(/type de projet/).selectOption("Site web (création ou refonte)");
  await page.getByLabel(/budget estimé/).selectOption({ index: 1 });
  await page.getByLabel(/délai souhaitez-vous/).selectOption({ index: 1 });
  await page.getByLabel(/Décrivez votre projet/).fill(VALID.message);
  await page.getByLabel(/J'accepte que mes données/).check();
}

test.describe("Formulaire de contact", () => {
  test("validation : erreurs reliées aux champs, focus sur le premier invalide", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();

    const name = page.getByLabel("Comment vous appelez-vous ?");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    const describedBy = await name.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText("Nom requis");

    // Résumé annoncé aux technologies d'assistance.
    await expect(page.locator('form [aria-live="assertive"]')).toContainText(/champs sont à corriger/);
  });

  test("les listes déroulantes ont un chevron visible", async ({ page }) => {
    await page.goto("/contact");
    const selects = page.locator("select");
    await expect(selects).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(selects.nth(i).locator("xpath=following-sibling::*[local-name()='svg']")).toBeVisible();
    }
  });

  test("le honeypot est hors tabulation et masqué", async ({ page }) => {
    await page.goto("/contact");
    const honeypot = page.locator("#website");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(await honeypot.evaluate((el) => el.closest("[aria-hidden='true']") !== null)).toBe(true);
  });

  test("succès : un seul envoi, charge utile conforme, confirmation focalisée", async ({ page }) => {
    let calls = 0;
    let body: Record<string, unknown> = {};
    await page.route("**/api/contact", async (route) => {
      calls += 1;
      body = route.request().postDataJSON();
      await new Promise((r) => setTimeout(r, 400)); // laisse le temps d'un double clic
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "ok" }),
      });
    });

    await page.goto("/contact");
    await fillValid(page);
    const submit = page.getByRole("button", { name: "Envoyer ma demande" });
    await submit.dblclick();

    const confirmation = page.getByRole("status");
    await expect(confirmation).toContainText("Votre demande a bien été reçue.");
    await expect(confirmation).toBeFocused();
    expect(calls).toBe(1);
    expect(body).toMatchObject({ name: VALID.name, email: VALID.email, company: VALID.company, projectType: "Site web (création ou refonte)", consent: true });
  });

  test("erreur serveur : message explicite, formulaire conservé", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ success: false, code: "config", message: "Le formulaire est momentanément indisponible. Écrivez-nous à contact.agency@nexcy.fr." }),
      }),
    );
    await page.goto("/contact");
    await fillValid(page);
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.getByText("momentanément indisponible")).toBeVisible();
    await expect(page.getByLabel("Comment vous appelez-vous ?")).toHaveValue(VALID.name);
    await expect(page.getByRole("button", { name: "Envoyer ma demande" })).toBeEnabled();
  });

  test("aucune erreur console sur la page", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    expect(getErrors()).toHaveLength(0);
  });
});

test.describe("API /api/contact", () => {
  test("refuse un Content-Type incorrect (415)", async ({ request }) => {
    const res = await request.post("/api/contact", { data: "x", headers: { "content-type": "text/plain" } });
    expect(res.status()).toBe(415);
  });

  test("refuse un JSON invalide (400)", async ({ request }) => {
    const res = await request.post("/api/contact", { data: "{pas du json", headers: { "content-type": "application/json" } });
    expect(res.status()).toBe(400);
  });

  test("refuse des données invalides (400, code validation)", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "A" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).code).toBe("validation");
  });

  test("refuse un budget hors liste (400)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, projectType: "Site web (création ou refonte)", budget: "1 €", deadline: "1 à 3 mois", consent: true },
    });
    expect(res.status()).toBe(400);
  });

  test("refuse une origine étrangère (403)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID },
      headers: { origin: "https://evil.example" },
    });
    expect(res.status()).toBe(403);
  });

  test("honeypot : succès silencieux sans envoi", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, projectType: "Site web (création ou refonte)", budget: "Budget à définir", deadline: "Pas de contrainte", consent: true, website: "http://spam.example" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test("sans clé Resend : 503 explicite (jamais de faux succès)", async ({ request }) => {
    test.skip(!!process.env.RESEND_API_KEY, "une vraie clé enverrait un e-mail réel");
    const res = await request.post("/api/contact", {
      data: { ...VALID, projectType: "Site web (création ou refonte)", budget: "Budget à définir", deadline: "Pas de contrainte", consent: true },
    });
    expect(res.status()).toBe(503);
    expect((await res.json()).code).toBe("config");
  });
});
