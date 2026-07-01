"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import { projectTypes, budgetRanges, deadlineOptions } from "@/data/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-btn border border-border bg-card px-4 py-3 text-base text-text-primary " +
  "placeholder:text-text-muted transition-colors duration-200 focus:border-accent focus:outline-none " +
  "min-h-[44px]";

/** Numéro de question doré. */
function QLabel({ n, children, htmlFor }: { n: string; children: string; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-3 text-base text-text-primary">
      <span aria-hidden="true" className="text-sm font-medium text-accent">
        {n}
      </span>
      <span>{children}</span>
    </label>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      deadline: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      const json = (await res.json()) as { success: boolean; message: string };
      if (res.ok && json.success) {
        setStatus("success");
        setServerMessage(json.message);
        reset();
        turnstileRef.current?.reset();
        setTurnstileToken("");
      } else {
        setStatus("error");
        setServerMessage(
          json.message ??
            "Une erreur s'est produite. Veuillez réessayer ou nous contacter directement à contact.agency@nexcy.fr",
        );
      }
    } catch {
      setStatus("error");
      setServerMessage(
        "Une erreur s'est produite. Veuillez réessayer ou nous contacter directement à contact.agency@nexcy.fr",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-card border border-accent/40 bg-card p-8 md:p-10"
      >
        <p className="text-2xl font-medium text-text-primary">
          Votre demande a bien été reçue.
        </p>
        <p className="mt-3 text-base text-text-secondary">
          Nous vous répondons sous 48 heures ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-10">
      {/* Honeypot — masqué visuellement et aux lecteurs d'écran */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* 1. Nom */}
      <div className="flex flex-col gap-3">
        <QLabel n="01" htmlFor="name">
          Comment vous appelez-vous ?
        </QLabel>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Nom complet"
          className={cn(inputBase, errors.name && "border-accent-dark")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-accent-light">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 2. E-mail */}
      <div className="flex flex-col gap-3">
        <QLabel n="02" htmlFor="email">
          Quelle est votre adresse e-mail professionnelle ?
        </QLabel>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="prenom@entreprise.fr"
          className={cn(inputBase, errors.email && "border-accent-dark")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-accent-light">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 3. Entreprise */}
      <div className="flex flex-col gap-3">
        <QLabel n="03" htmlFor="company">
          Quelle entreprise représentez-vous ?
        </QLabel>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          placeholder="Nom de l'entreprise"
          className={cn(inputBase, errors.company && "border-accent-dark")}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
          {...register("company")}
        />
        {errors.company && (
          <p id="company-error" className="text-sm text-accent-light">
            {errors.company.message}
          </p>
        )}
      </div>

      {/* 4. Type de projet */}
      <div className="flex flex-col gap-3">
        <QLabel n="04" htmlFor="projectType">
          Quel type de projet souhaitez-vous réaliser ?
        </QLabel>
        <select
          id="projectType"
          defaultValue=""
          className={cn(inputBase, "appearance-none", errors.projectType && "border-accent-dark")}
          aria-invalid={!!errors.projectType}
          aria-describedby={errors.projectType ? "projectType-error" : undefined}
          {...register("projectType")}
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p id="projectType-error" className="text-sm text-accent-light">
            {errors.projectType.message}
          </p>
        )}
      </div>

      {/* 5. Budget */}
      <div className="flex flex-col gap-3">
        <QLabel n="05" htmlFor="budget">
          Quel est votre budget estimé ?
        </QLabel>
        <select
          id="budget"
          defaultValue=""
          className={cn(inputBase, "appearance-none", errors.budget && "border-accent-dark")}
          aria-invalid={!!errors.budget}
          aria-describedby={errors.budget ? "budget-error" : undefined}
          {...register("budget")}
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {budgetRanges.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p id="budget-error" className="text-sm text-accent-light">
            {errors.budget.message}
          </p>
        )}
      </div>

      {/* 6. Délai */}
      <div className="flex flex-col gap-3">
        <QLabel n="06" htmlFor="deadline">
          Dans quel délai souhaitez-vous lancer ?
        </QLabel>
        <select
          id="deadline"
          defaultValue=""
          className={cn(inputBase, "appearance-none", errors.deadline && "border-accent-dark")}
          aria-invalid={!!errors.deadline}
          aria-describedby={errors.deadline ? "deadline-error" : undefined}
          {...register("deadline")}
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {deadlineOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.deadline && (
          <p id="deadline-error" className="text-sm text-accent-light">
            {errors.deadline.message}
          </p>
        )}
      </div>

      {/* 7. Message */}
      <div className="flex flex-col gap-3">
        <QLabel n="07" htmlFor="message">
          Décrivez votre projet en quelques lignes.
        </QLabel>
        <textarea
          id="message"
          rows={5}
          placeholder="Contexte, objectifs, contraintes particulières…"
          className={cn(inputBase, "resize-y", errors.message && "border-accent-dark")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-accent-light">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* 8. Consentement RGPD */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-accent"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-text-secondary">
            J&apos;accepte que mes données soient utilisées pour traiter ma demande,
            conformément à la{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-text-primary underline decoration-accent underline-offset-4"
            >
              politique de confidentialité
            </a>{" "}
            de NEXCY.
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="text-sm text-accent-light">
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Turnstile (rendu uniquement si la clé publique est configurée) */}
      {siteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "dark", language: "fr" }}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-btn bg-accent px-8 py-3.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-accent-light disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Envoi…" : "Envoyer ma demande"}
        </button>

        {status === "error" && (
          <p role="alert" className="text-sm text-accent-light">
            {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}
