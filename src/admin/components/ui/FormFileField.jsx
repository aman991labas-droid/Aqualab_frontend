'use client'

import FileUpload from './FileUpload'

export default function FormFileField({ label, required, accept = 'image/*', onChange, preview, previewClassName = '' }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <FileUpload accept={accept} onChange={onChange} />
      {preview ? (
        <img
          src={preview}
          alt="Aperçu"
          className={`admin-image-preview ${previewClassName}`.trim()}
        />
      ) : null}
    </div>
  )
}
