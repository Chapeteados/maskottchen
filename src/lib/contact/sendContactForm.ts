/**
 * Envío del formulario → `POST /api/{MESSAGES_PATH}` (debe coincidir con el API ID plural del content-type en Strapi).
 * Si cambias el nombre en Strapi (p. ej. `mensajes`), cambia solo `MESSAGES_PATH` aquí.
 */

import { postStrapi } from "../strapi";
import type { ContactFormPayload, StrapiPostResult } from "../strapi.types";

/** Plural API ID del collection type en Strapi (Settings → Content-Type Builder). */
const MESSAGES_PATH = "messages";

export async function sendContactForm(values: ContactFormPayload): Promise<StrapiPostResult> {
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    message: values.message.trim(),
  };

  return postStrapi(MESSAGES_PATH, data);
}
