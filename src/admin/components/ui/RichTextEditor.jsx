'use client'

import Textarea from './Textarea'

export default function RichTextEditor({ label, value, onChange, required, error }) {
  return (
    <Textarea
      label={label}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      rows={10}
      placeholder="Contenu riche (Markdown/HTML) ..."
    />
  )
}

