'use client'

import { useRef } from 'react'
import { UploadCloud } from 'lucide-react'

export default function FileUpload({ label = 'Choisir un fichier', onChange, accept = '*' }) {
  const inputRef = useRef(null)

  const openPicker = () => inputRef.current?.click()

  return (
    <div
      className="admin-file-upload"
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
    >
      <UploadCloud size={18} aria-hidden="true" />
      <span>{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="admin-file-upload__input"
        tabIndex={-1}
      />
    </div>
  )
}
