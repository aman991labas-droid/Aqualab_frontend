import { apiFetch } from './client'

/**
 * Laravel contract — public submission (application/json):
 * POST /api/contact
 * Body: { name, email, tel?, company?, message }
 *
 * @param {import('@/types/forms').ContactFormPayload} payload
 */
export function submitContactForm(payload) {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
      tel: payload.tel?.trim() || null,
      company: payload.company?.trim() || null,
    }),
  })
}
