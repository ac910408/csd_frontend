import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, formatCUM, formatDateTime, capitalize } from '@/utils/format'

describe('formatDate', () => {
  it('retorna — si no hay timestamp', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(0)).toBe('—')
  })

  it('formatea fecha larga en español', () => {
    const ts = new Date('2025-06-15').getTime()
    const result = formatDate(ts)
    expect(result).toContain('junio')
    expect(result).toContain('2025')
  })

  it('formatea fecha corta dd/mm/aaaa', () => {
    const ts = Date.UTC(2025, 5, 15) // usa UTC para evitar timezone
    const result = formatDate(ts, { corta: true })
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})

describe('formatCurrency', () => {
  it('formatea en pesos mexicanos', () => {
    const result = formatCurrency(1500.5)
    expect(result).toContain('1,500.50')
    expect(result).toContain('$')
  })

  it('retorna — si es null', () => {
    expect(formatCurrency(null)).toBe('—')
  })
})

describe('formatCUM', () => {
  it('inserta guión', () => {
    expect(formatCUM('ASO1234567')).toBe('ASO-1234567')
  })

  it('retorna — si vacío', () => {
    expect(formatCUM('')).toBe('—')
    expect(formatCUM(null)).toBe('—')
  })
})

describe('capitalize', () => {
  it('capitaliza palabras', () => {
    expect(capitalize('juan pérez')).toBe('Juan Pérez')
  })
})
