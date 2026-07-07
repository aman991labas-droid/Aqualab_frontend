'use client'

export default function Select({ label, options = [], required, error, ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <select className={`form-input ${error ? 'form-input--error' : ''}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

