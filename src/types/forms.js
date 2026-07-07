/**
 * @typedef {Object} ContactFormPayload
 * @property {string} name
 * @property {string} email
 * @property {string} [tel]
 * @property {string} [company]
 * @property {string} message
 */

/**
 * @typedef {Object} ApplicationFormPayload
 * @property {string} name
 * @property {string} email
 * @property {string} [tel]
 * @property {string} [jobType]
 * @property {string} message
 * @property {File} [cvFile]
 */

/**
 * @typedef {'api' | 'emailjs' | 'mailto'} FormSubmissionChannel
 */

/**
 * @typedef {Object} FormSubmissionResult
 * @property {boolean} ok
 * @property {FormSubmissionChannel} channel
 * @property {string} [message]
 * @property {Object} [data]
 */

/**
 * @typedef {'new' | 'under_review' | 'accepted' | 'rejected'} ApplicationStatus
 */

/**
 * @typedef {Object} ApplicationRecord
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} tel
 * @property {string} jobType
 * @property {string} cvFile
 * @property {string} cvUrl
 * @property {string} message
 * @property {string} submittedAt
 * @property {ApplicationStatus} status
 */

export {}
