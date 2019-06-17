import { expect } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import AppSelectorItem from '@/components/AppSelectorItem'

let localVue = createLocalVue()
let wrapper

describe('components/AppSelectorItem.vue', () => {
  let common = { localVue, propsData: { crustapp: {}, appIndex: 0 }, mocks: { $t: (t) => t } }

  describe('template', () => {
    it('app.open.tab', () => {
      wrapper = mount(AppSelectorItem, common)
      expect(wrapper.emitted().doadd).to.eq(undefined)
      wrapper.find('div.open-tab a').trigger('click')
      expect(wrapper.emitted().doadd).to.not.eq(undefined)
    })
  })

  describe('computed', () => {
    it('appName', () => {
      let local = { crustapp: {} }
      expect(AppSelectorItem.computed.appName.call(local)).to.eq('')

      local = { crustapp: { name: 'name' } }
      expect(AppSelectorItem.computed.appName.call(local)).to.eq('name')
    })
  })
})
