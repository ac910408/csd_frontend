import { describe, it, expect } from 'vitest'
import { useForm } from '@/utils/validators'

describe('useForm', () => {
  const reglas = {
    nombre: { requerido: true, minLength: 3 },
    correo: { requerido: true, email: true },
    telefono: { telefono: true },
    cum: { cum: true },
  }

  it('valida campo requerido', () => {
    const { validarValor } = useForm(reglas)
    expect(validarValor('nombre', '')).toBe('Campo obligatorio')
    expect(validarValor('nombre', 'Jo')).toBe('Mínimo 3 caracteres')
    expect(validarValor('nombre', 'Juan')).toBeNull()
  })

  it('valida email', () => {
    const { validarValor } = useForm(reglas)
    expect(validarValor('correo', 'mal')).toBe('Correo inválido')
    expect(validarValor('correo', 'bien@test.com')).toBeNull()
  })

  it('valida teléfono 10 dígitos', () => {
    const { validarValor } = useForm(reglas)
    expect(validarValor('telefono', '123')).toBe('Teléfono debe tener 10 dígitos')
    expect(validarValor('telefono', '5512345678')).toBeNull()
  })

  it('valida CUM', () => {
    const { validarValor } = useForm(reglas)
    expect(validarValor('cum', 'abc')).toBe('Formato CUM inválido (ej: ASO1234567)')
    expect(validarValor('cum', 'ASO1234567')).toBeNull()
  })

  it('validarTodo retorna true si no hay errores', () => {
    const { validarTodo } = useForm(reglas)
    expect(validarTodo({
      nombre: 'Juan',
      correo: 'juan@test.com',
      telefono: '5512345678',
      cum: 'ASO1234567',
    })).toBe(true)
  })

  it('validarTodo retorna false si hay errores', () => {
    const { validarTodo } = useForm(reglas)
    expect(validarTodo({
      nombre: '',
      correo: 'mal',
      telefono: '',
      cum: '',
    })).toBe(false)
  })
})
