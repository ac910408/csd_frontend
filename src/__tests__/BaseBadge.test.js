import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

describe('BaseBadge', () => {
  it('renderiza slot', () => {
    const wrapper = mount(BaseBadge, {
      slots: { default: 'Activo' },
    })
    expect(wrapper.text()).toContain('Activo')
  })

  it('aplica clase de color outline', () => {
    const wrapper = mount(BaseBadge, {
      props: { color: 'success', outline: true },
    })
    expect(wrapper.classes()).toContain('border-success')
    expect(wrapper.classes()).toContain('text-success')
  })
})
