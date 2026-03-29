import { useCallback, useRef, useState } from "react";

import { sendContactForm } from "../lib/contact/sendContactForm";
import type { ContactFormValues } from "../lib/strapi.types";

type UseContactFormSubmitOptions = {
  /** Se llama tras un envío correcto (p. ej. `reset` de react-hook-form). */
  onSuccess?: () => void;
};

export function useContactFormSubmit(options?: UseContactFormSubmitOptions) {
  const onSuccess = options?.onSuccess;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState(false);
  const submitLockRef = useRef(false);

  const submit = useCallback(
    async (values: ContactFormValues) => {
      if (submitLockRef.current) {
        return;
      }
      submitLockRef.current = true;
      setSubmitError(null);
      setSubmitOk(false);
      setIsSubmitting(true);
      try {
        const result = await sendContactForm(values);
        if (result.ok) {
          setSubmitOk(true);
          onSuccess?.();
          return;
        }
        setSubmitError(result.message);
      } finally {
        submitLockRef.current = false;
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { submit, isSubmitting, submitError, submitOk };
}
