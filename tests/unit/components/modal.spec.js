import { expect } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import Modal from '@/components/Modal'

let wrapper
let localVue = createLocalVue()

describe('components/Modal.vue', () => {
  let common = { localVue, mocks: { $t: (t) => t } }
  describe('template', () => {
    it('close', () => {
      wrapper = mount(Modal, common)

      expect(wrapper.emitted().close).to.eq(undefined)
      wrapper.find('span.modal-close-button').trigger('click')
      expect(wrapper.emitted().close).to.not.eq(undefined)
    })
  })
})
