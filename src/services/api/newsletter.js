import { apiFetch } from './client'

export function subscribeNewsletter(email) {
  return apiFetch('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim() }),
  })
}

export function unsubscribeNewsletter(token) {
  return apiFetch('/api/newsletter/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })
}
