'use client'

export default function Textarea({ label, required, error, ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <textarea className={`form-input form-textarea ${error ? 'form-input--error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

