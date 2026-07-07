import emailjs from '@emailjs/browser'
import { isApiConfigured } from '@/services/api/client'
import { submitContactForm as submitContactToApi } from '@/services/api/contact'
import {
  EMAILJS_CONFIGURED,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from '@/lib/emailjs'

const CONTACT_EMAIL = 'info@aqualab.ma'

/**
 * @param {FormData | Record<string, FormDataEntryValue>} source
 * @returns {import('@/types/forms').ContactFormPayload}
 */
export function parseContactPayload(source) {
  const data = source instanceof FormData ? Object.fromEntries(source) : source

  return {
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    tel: data.tel ? String(data.tel) : '',
    company: data.company ? String(data.company) : '',
    message: String(data.message ?? ''),
  }
}

function openContactMailto(payload) {
  const body = encodeURIComponent(
    `Nom: ${payload.name}\nEmail: ${payload.email}\nTéléphone: ${payload.tel || 'N/A'}\nEntreprise: ${payload.company || 'N/A'}\n\nMessage:\n${payload.message}`,
  )

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Demande de contact – ${payload.name}`)}&body=${body}`
}

/**
 * Submit contact form with Laravel API → EmailJS → mailto fallback.
 *
 * @param {{
 *   form?: HTMLFormElement | null,
 *   payload: import('@/types/forms').ContactFormPayload,
 * }} options
 * @returns {Promise<import('@/types/forms').FormSubmissionResult>}
 */
export async function submitContact({ form, payload }) {
  if (isApiConfigured()) {
    const data = await submitContactToApi(payload)
    return { ok: true, channel: 'api', data }
  }

  if (EMAILJS_CONFIGURED && form) {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY)
    return { ok: true, channel: 'emailjs' }
  }

  openContactMailto(payload)
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { ok: true, channel: 'mailto' }
}
