'use client'

import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <label className="admin-search">
      <Search size={16} aria-hidden="true" />
      <input className="form-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

