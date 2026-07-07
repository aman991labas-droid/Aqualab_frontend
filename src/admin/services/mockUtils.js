export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

