"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import { projectTypes, budgetRanges, deadlineOptions } from "@/data/contact";
import { CONTACT_EMAIL } from "@/data/navigation";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full min-h-[48px] rounded-btn border border-border bg-card px-4 py-3 text-base text-text-primary " +
  "placeholder:text-text-muted transition-colors duration-200 " +
  "hover:border-line-strong focus:border-accent focus:outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const GENERIC_ERROR = `Une erreur s'est produite. Réessayez ou écrivez-nous directement à ${CONTACT_EMAIL}.`;

/**
 * Champ : numéro de question, libellé, contrôle, message d'erreur relié par
 * aria-describedby. Le libellé reste un vrai <label> (clic = focus).
 */
function Field({
  n,
  id,
  label,
  error,
  children,
}: {
  n: string;
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="flex items-baseline gap-3 text-base text-text-primary">
        <span aria-hidden="true" className="t-tech text-accent">
          {n}
        </span>
        <span>{label}</span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-2 text-sm text-danger">
          <span
            aria-hidden="true"
            className="mt-[0.45em] block h-px w-3 shrink-0 bg-danger"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Liste déroulante native avec chevron explicite (affordance visible). */
function Select({
  id,
  options,
  invalid,
  describedBy,
  ...rest
}: {
  id: string;
  options: readonly string[];
  invalid: boolean;
  describedBy?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        id={id}
        defaultValue=""
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(fieldBase, "appearance-none pr-12", invalid && "border-danger/70")}
        {...rest}
      >
        <option value="" disabled>
          Sélectionnez…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-text-secondary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M1 1.5 6 6.5l5-5" strokeLinecap="square" />
      </svg>
    </div>
  );
}

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  // En production, sans clé publique Turnstile, le formulaire ne peut pas aboutir :
  // on l'annonce clairement plutôt que d'afficher un formulaire voué à l'échec.
  const unavailable = process.env.NODE_ENV === "production" && !siteKey;

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      consent: false,
      website: "",
    } as unknown as ContactFormData,
  });

  // Après succès : le focus passe sur la confirmation (annoncée par role="status").
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (data: ContactFormData) => {
    // Garde contre le double envoi (double-clic, Entrée répétée).
    if (submittingRef.current) return;

    if (siteKey && !turnstileToken) {
      setStatus("error");
      setServerMessage(
        "La vérification de sécurité est en cours. Patientez un instant, puis renvoyez le formulaire.",
      );
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (res.ok && json?.success) {
        setStatus("success");
        setServerMessage(json.message ?? "");
        reset();
      } else {
        setStatus("error");
        setServerMessage(json?.message ?? GENERIC_ERROR);
      }
    } catch {
      setStatus("error");
      setServerMessage(GENERIC_ERROR);
    } finally {
      submittingRef.current = false;
      // Un token Turnstile est à usage unique : on en demande un nouveau.
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  };

  if (unavailable) {
    return (
      <div role="status" className="rounded-card border border-border bg-card p-8 md:p-10">
        <p className="t-h3 text-text-primary">Le formulaire est momentanément indisponible.</p>
        <p className="t-body mt-3 text-text-secondary">
          Écrivez-nous directement, nous répondons sous 48 heures ouvrées.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 inline-flex min-h-[48px] items-center rounded-btn bg-accent px-7 text-sm font-medium text-black transition-colors duration-200 hover:bg-accent-light"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border border-accent/40 bg-card p-8 outline-none md:p-10"
      >
        <p className="text-2xl font-medium text-text-primary">
          Votre demande a bien été reçue.
        </p>
        <p className="t-body mt-3 text-text-secondary">
          Nous vous répondons sous 48 heures ouvrées. Un accusé de réception vous
          est envoyé par e-mail.
        </p>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  const busy = status === "submitting";
  const id = (name: string) => `${uid}-${name}`.replace(/:/g, "");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={busy}
      className="flex flex-col gap-10"
    >
      {/* Honeypot — masqué visuellement et aux technologies d'assistance */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Field n="01" id={id("name")} label="Comment vous appelez-vous ?" error={errors.name?.message}>
        <input
          id={id("name")}
          type="text"
          autoComplete="name"
          placeholder="Nom complet"
          className={cn(fieldBase, errors.name && "border-danger/70")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id("name")}-error` : undefined}
          {...register("name")}
        />
      </Field>

      <Field
        n="02"
        id={id("email")}
        label="Quelle est votre adresse e-mail professionnelle ?"
        error={errors.email?.message}
      >
        <input
          id={id("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="prenom@entreprise.fr"
          className={cn(fieldBase, errors.email && "border-danger/70")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${id("email")}-error` : undefined}
          {...register("email")}
        />
      </Field>

      <Field
        n="03"
        id={id("company")}
        label="Quelle entreprise représentez-vous ?"
        error={errors.company?.message}
      >
        <input
          id={id("company")}
          type="text"
          autoComplete="organization"
          placeholder="Nom de l'entreprise"
          className={cn(fieldBase, errors.company && "border-danger/70")}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? `${id("company")}-error` : undefined}
          {...register("company")}
        />
      </Field>

      <Field
        n="04"
        id={id("projectType")}
        label="Quel type de projet souhaitez-vous réaliser ?"
        error={errors.projectType?.message}
      >
        <Select
          id={id("projectType")}
          options={projectTypes}
          invalid={!!errors.projectType}
          describedBy={errors.projectType ? `${id("projectType")}-error` : undefined}
          {...register("projectType")}
        />
      </Field>

      <Field
        n="05"
        id={id("budget")}
        label="Quel est votre budget estimé ?"
        error={errors.budget?.message}
      >
        <Select
          id={id("budget")}
          options={budgetRanges}
          invalid={!!errors.budget}
          describedBy={errors.budget ? `${id("budget")}-error` : undefined}
          {...register("budget")}
        />
      </Field>

      <Field
        n="06"
        id={id("deadline")}
        label="Dans quel délai souhaitez-vous lancer ?"
        error={errors.deadline?.message}
      >
        <Select
          id={id("deadline")}
          options={deadlineOptions}
          invalid={!!errors.deadline}
          describedBy={errors.deadline ? `${id("deadline")}-error` : undefined}
          {...register("deadline")}
        />
      </Field>

      <Field
        n="07"
        id={id("message")}
        label="Décrivez votre projet en quelques lignes."
        error={errors.message?.message}
      >
        <textarea
          id={id("message")}
          rows={5}
          autoComplete="off"
          placeholder="Contexte, objectifs, contraintes particulières…"
          className={cn(fieldBase, "resize-y", errors.message && "border-danger/70")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id("message")}-error` : undefined}
          {...register("message")}
        />
      </Field>

      {/* Consentement RGPD */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            type="checkbox"
            className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-accent"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
            {...register("consent")}
          />
          <label htmlFor={id("consent")} className="text-sm leading-relaxed text-text-secondary">
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
        {errors.consent ? (
          <p id={`${id("consent")}-error`} className="flex items-start gap-2 text-sm text-danger">
            <span aria-hidden="true" className="mt-[0.45em] block h-px w-3 shrink-0 bg-danger" />
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Turnstile : rendu uniquement si la clé publique est configurée.
          Mode « interaction seule » : le défi n'apparaît que s'il est nécessaire. */}
      {siteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onError={() => setTurnstileToken("")}
          options={{ theme: "dark", language: "fr", appearance: "interaction-only" }}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-btn bg-accent px-8 py-3.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>

        {/* Région vivante : annonce le résumé d'erreurs et les erreurs serveur. */}
        <div aria-live="assertive" className="min-h-[1.25rem]">
          {submitCount > 0 && errorCount > 0 && status !== "error" ? (
            <p className="text-sm text-danger">
              {errorCount === 1
                ? "Un champ est à corriger."
                : `${errorCount} champs sont à corriger.`}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-danger">{serverMessage}</p>
          ) : null}
        </div>

        <p className="t-tech text-text-muted">
          Réponse sous 48 heures ouvrées · Protégé par Cloudflare Turnstile
        </p>
      </div>
    </form>
  );
}
