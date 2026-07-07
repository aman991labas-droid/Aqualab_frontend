'use client'

import FileUpload from './FileUpload'

export default function ImageUpload({ preview, onFileChange }) {
  return (
    <div className="admin-image-upload">
      <FileUpload label="Uploader une image" accept="image/*" onChange={onFileChange} />
      {preview && <img src={preview} alt="Apercu" className="admin-image-preview" />}
    </div>
  )
}

