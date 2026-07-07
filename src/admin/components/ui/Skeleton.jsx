'use client'

export default function Skeleton({ lines = 3 }) {
  return (
    <div className="admin-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="admin-skeleton__line" />
      ))}
    </div>
  )
}

