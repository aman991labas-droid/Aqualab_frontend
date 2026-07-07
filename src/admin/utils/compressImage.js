function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }
    img.src = url
  })
}

/**
 * Resize/compress images before admin upload to keep API payloads small.
 */
export async function compressImageFile(
  file,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.82, skipBelowBytes = 180 * 1024 } = {},
) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Fichier image invalide.')
  }

  if (file.size <= skipBelowBytes) {
    return readFileAsDataUrl(file)
  }

  const img = await loadImageElement(file)
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
  const width = Math.max(1, Math.round(img.width * ratio))
  const height = Math.max(1, Math.round(img.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(img, 0, 0, width, height)

  const useJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp'
  const mime = useJpeg ? 'image/jpeg' : 'image/png'
  return canvas.toDataURL(mime, useJpeg ? quality : undefined)
}
