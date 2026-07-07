export function getProductGroupLabel(groupId, mainCategories = []) {
  return mainCategories.find((group) => group.id === groupId)?.label ?? groupId
}

export function getCategoryPath(slug) {
  return `/produits/${slug}`
}

export function normalizeProductItem(item) {
  if (typeof item === 'string') {
    return { name: item, image: null, imageAlt: null, details: null }
  }

  return {
    name: item?.name ?? '',
    image: item?.image ?? null,
    imageAlt: item?.imageAlt ?? item?.name ?? null,
    details: item?.details ?? null,
  }
}
