import { apiFetch, apiUpload } from './client'

/**
 * Laravel contract — public submission (multipart/form-data):
 * POST /api/applications
 * Fields: name, email, tel?, job_type?, message, cv? (file, pdf/doc/docx)
 *
 * @param {import('@/types/forms').ApplicationFormPayload} payload
 */
export function submitApplication(payload) {
  const formData = new FormData()
  formData.append('name', payload.name.trim())
  formData.append('email', payload.email.trim())
  formData.append('message', payload.message.trim())

  if (payload.tel?.trim()) {
    formData.append('tel', payload.tel.trim())
  }

  if (payload.jobType?.trim()) {
    formData.append('job_type', payload.jobType.trim())
  }

  if (payload.cvFile) {
    formData.append('cv', payload.cvFile)
  }

  return apiUpload('/api/applications', formData)
}

/** GET /api/applications — admin list (Sanctum) */
export function fetchApplications(options) {
  return apiFetch('/api/applications', options)
}

/** GET /api/applications/{id} — admin detail (Sanctum) */
export function fetchApplicationById(id, options) {
  return apiFetch(`/api/applications/${id}`, options)
}

/** PATCH /api/applications/{id} — admin status update (Sanctum) */
export function updateApplicationStatus(id, status) {
  return apiFetch(`/api/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

/** DELETE /api/applications/{id} — admin delete (Sanctum) */
export function deleteApplication(id) {
  return apiFetch(`/api/applications/${id}`, { method: 'DELETE' })
}
