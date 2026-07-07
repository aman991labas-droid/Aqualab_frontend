'use client'

import { UploadCloud } from 'lucide-react'

export default function FileUpload({ label = 'Choisir un fichier', onChange, accept = '*' }) {
  return (
    <label className="admin-file-upload">
      <UploadCloud size={18} />
      <span>{label}</span>
      <input type="file" accept={accept} onChange={onChange} />
    </label>
  )
}

