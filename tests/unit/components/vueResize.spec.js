import { expect, assert } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import VueResize from '@/components/VueResize'
import sinon from 'sinon'

let localVue = createLocalVue()
let wrapper

describe('components/VueResize.vue', () => {
  let common = { localVue, propsData: { active: true } }

  describe('methods', () => {
    let commit = sinon.fake()

    beforeEach(() => {
      commit.resetHistory()
    })

    it('onResize', () => {
      wrapper = mount(VueResize, { ...common, mocks: { $store: { commit } } })
      let newRect = { rect: 'rect' }
      expect(wrapper.emitted().resize).to.eq(undefined)

      wrapper.vm.onResize(newRect)
      expect(wrapper.emitted().resize.pop().pop()).to.deep.eq(newRect)
      assert(commit.calledOnceWith('panes/setResizing', true))
    })

    it('onStopResize', () => {
      wrapper = mount(VueResize, { ...common, mocks: { $store: { commit } } })
      expect(wrapper.emitted().stopresize).to.eq(undefined)

      wrapper.vm.onStopResize()
      expect(wrapper.emitted().stopresize).to.not.eq(undefined)
      assert(commit.calledOnceWith('panes/setResizing', false))
    })

    it('onActivation', () => {
      wrapper = mount(VueResize, common)
      expect(wrapper.emitted().activated).to.eq(undefined)

      wrapper.vm.onActivation()
      expect(wrapper.emitted().activated).to.not.eq(undefined)
    })
  })
})
