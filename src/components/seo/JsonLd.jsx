/**
 * Keeps structured data attached without rendering script tags in React.
 * Use alongside generateMetadata() for full SEO coverage.
 */
export default function JsonLd({ data, idPrefix = 'json-ld' }) {
  if (!data) return null

  const schemas = Array.isArray(data) ? data : [data]

  return schemas.map((schema, index) => (
    <template
      key={index}
      id={`${idPrefix}-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ))
}
