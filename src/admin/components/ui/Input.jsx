'use client'

export default function Input({ label, required, error,value, ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <input className={`form-input ${error ? 'form-input--error' : ''}`} value={value ?? ""} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

