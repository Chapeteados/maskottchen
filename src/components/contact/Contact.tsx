import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { sendContactForm } from "../../lib/contact/sendContactForm";
import { primaryButtonSubmitClass } from "../../lib/primaryButtonClasses";
import type { ContactFormValues } from "../../lib/strapi.types";

import { FormTextareaField } from "./FormTextareaField";
import { FormTextField } from "./FormTextField";

export type { ContactFormValues };

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState(false);
  const submitLockRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    if (submitLockRef.current) {
      return;
    }
    submitLockRef.current = true;
    setSubmitError(null);
    setSubmitOk(false);
    setIsSubmitting(true);
    try {
      const result = await sendContactForm(data);
      if (result.ok) {
        setSubmitOk(true);
        reset();
        return;
      }
      setSubmitError(result.message);
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4"
      noValidate
    >
      {submitOk ? (
        <p
          className="rounded-md bg-green-50 px-3 py-2 text-center text-sm text-green-800"
          role="status"
        >
          Mensaje enviado. Gracias.
        </p>
      ) : null}
      {submitError ? (
        <p
          className="rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-800"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <FormTextField
        id="contact-name"
        label="Nombre"
        placeholder="Nombre"
        autoComplete="name"
        type="text"
        error={errors.name?.message}
        {...register("name", { required: "El nombre es obligatorio" })}
      />

      <FormTextField
        id="contact-email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
        autoComplete="email"
        type="email"
        error={errors.email?.message}
        {...register("email", {
          required: "El correo es obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Introduce un correo válido",
          },
        })}
      />

      <Controller
        name="phone"
        control={control}
        rules={{
          validate: (value: string) => {
            if (value === "") {
              return true;
            }
            return value.length === 10 || "El teléfono debe tener 10 dígitos";
          },
        }}
        render={({ field, fieldState }) => (
          <FormTextField
            id="contact-phone"
            label="Teléfono (opcional)"
            placeholder="Teléfono"
            autoComplete="tel"
            inputMode="numeric"
            type="tel"
            name={field.name}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            ref={field.ref}
            error={fieldState.error?.message}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
              field.onChange(digitsOnly);
            }}
          />
        )}
      />

      <FormTextareaField
        id="contact-message"
        label="Mensaje"
        placeholder="Mensaje"
        rows={5}
        error={errors.message?.message}
        {...register("message", {
          required: "El mensaje es obligatorio",
          minLength: { value: 5, message: "Escribe al menos 5 caracteres" },
        })}
      />

      <button type="submit" disabled={isSubmitting} className={primaryButtonSubmitClass}>
        {isSubmitting ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
