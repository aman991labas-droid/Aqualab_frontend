import emailjs from '@emailjs/browser'
import { isApiConfigured } from '@/services/api/client'
import { submitApplication as submitApplicationToApi } from '@/services/api/applications'
import {
  EMAILJS_CONFIGURED,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from '@/lib/emailjs'

const CONTACT_EMAIL = 'info@aqualab.ma'

/**
 * @param {FormData | Record<string, FormDataEntryValue>} source
 * @param {File | null} [cvFile]
 * @returns {import('@/types/forms').ApplicationFormPayload}
 */
export function parseApplicationPayload(source, cvFile = null) {
  const data = source instanceof FormData ? Object.fromEntries(source) : source
  const fileFromForm = source instanceof FormData ? source.get('cvFile') : null
  const resolvedFile =
    cvFile ||
    (fileFromForm instanceof File && fileFromForm.size > 0 ? fileFromForm : undefined)

  return {
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    tel: data.tel ? String(data.tel) : '',
    jobType: data.jobType ? String(data.jobType) : '',
    message: String(data.message ?? ''),
    cvFile: resolvedFile,
  }
}

function openApplicationMailto(payload) {
  const body = encodeURIComponent(
    `Candidature Spontanée\n\nNom: ${payload.name}\nEmail: ${payload.email}\nTéléphone: ${payload.tel || 'N/A'}\nDomaine d'intérêt: ${payload.jobType || 'N/A'}\n\nMotivation:\n${payload.message}\n\n(Veuillez joindre votre CV à cet email si ce n'est pas déjà fait.)`,
  )

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Candidature Spontanée – ${payload.name}`)}&body=${body}`
}

/**
 * Submit recrutement application with Laravel API → EmailJS → mailto fallback.
 *
 * @param {{
 *   form?: HTMLFormElement | null,
 *   payload: import('@/types/forms').ApplicationFormPayload,
 * }} options
 * @returns {Promise<import('@/types/forms').FormSubmissionResult>}
 */
export async function submitApplication({ form, payload }) {
  if (isApiConfigured()) {
    const data = await submitApplicationToApi(payload)
    return { ok: true, channel: 'api', data }
  }

  if (EMAILJS_CONFIGURED && form) {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY)
    return { ok: true, channel: 'emailjs' }
  }

  openApplicationMailto(payload)
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { ok: true, channel: 'mailto' }
}
