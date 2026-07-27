export function getProductGroupLabel(groupId, mainCategories = []) {
  return mainCategories.find((group) => group.id === groupId)?.label ?? groupId
}

export function getCategoryPath(slug) {
  return `/produits/${slug}`
}

/** Normalise les images d'un item (legacy `image` ou nouveau `images[]`) */
export function normalizeProductImages(item, fallbackName = '') {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    return item.images
      .map((img) => {
        if (typeof img === 'string') {
          return { url: img, alt: fallbackName }
        }
        const url = img?.url ?? img?.image ?? ''
        if (!url) return null
        return {
          url,
          alt: img?.alt ?? img?.imageAlt ?? fallbackName,
        }
      })
      .filter(Boolean)
  }

  if (item?.image) {
    return [{ url: item.image, alt: item?.imageAlt ?? fallbackName }]
  }

  return []
}

export function normalizeProductItem(item) {
  if (typeof item === 'string') {
    return { name: item, images: [], image: null, imageAlt: null, details: null }
  }

  const name = item?.name ?? ''
  const images = normalizeProductImages(item, name)

  return {
    name,
    images,
    image: images[0]?.url ?? null,
    imageAlt: images[0]?.alt ?? name,
    details: item?.details ?? null,
  }
}
