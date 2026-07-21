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

function getTrimBounds(imageData, threshold = 248) {
  const { data, width, height } = imageData
  let top = height
  let left = width
  let right = 0
  let bottom = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      const isEmpty = a < 12 || (r >= threshold && g >= threshold && b >= threshold)

      if (!isEmpty) {
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
        left = Math.min(left, x)
        right = Math.max(right, x)
      }
    }
  }

  if (right < left || bottom < top) return null

  return {
    top,
    left,
    width: right - left + 1,
    height: bottom - top + 1,
  }
}

/**
 * Trim empty margins, then fit partner logos to a consistent canvas for display.
 */
export async function normalizePartnerLogoFile(
  file,
  { canvasWidth = 320, canvasHeight = 144, quality = 0.9 } = {},
) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Fichier image invalide.')
  }

  const img = await loadImageElement(file)
  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = img.width
  sourceCanvas.height = img.height
  const sourceCtx = sourceCanvas.getContext('2d')
  sourceCtx.drawImage(img, 0, 0)

  const bounds = getTrimBounds(sourceCtx.getImageData(0, 0, img.width, img.height))
  const trimmedCanvas = document.createElement('canvas')
  const trimmedCtx = trimmedCanvas.getContext('2d')

  if (bounds) {
    trimmedCanvas.width = bounds.width
    trimmedCanvas.height = bounds.height
    trimmedCtx.drawImage(
      sourceCanvas,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      0,
      0,
      bounds.width,
      bounds.height,
    )
  } else {
    trimmedCanvas.width = img.width
    trimmedCanvas.height = img.height
    trimmedCtx.drawImage(img, 0, 0)
  }

  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = canvasWidth
  outputCanvas.height = canvasHeight
  const outputCtx = outputCanvas.getContext('2d')
  const scale = Math.min(
    canvasWidth / trimmedCanvas.width,
    canvasHeight / trimmedCanvas.height,
  )
  const drawWidth = trimmedCanvas.width * scale
  const drawHeight = trimmedCanvas.height * scale
  const offsetX = (canvasWidth - drawWidth) / 2
  const offsetY = (canvasHeight - drawHeight) / 2

  outputCtx.drawImage(trimmedCanvas, offsetX, offsetY, drawWidth, drawHeight)

  const useJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg'
  const mime = useJpeg ? 'image/jpeg' : 'image/png'
  return outputCanvas.toDataURL(mime, useJpeg ? quality : undefined)
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
