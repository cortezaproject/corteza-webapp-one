import { expect } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import AppSelector from '@/components/AppSelector'
import sinon from 'sinon'
import fp from 'flush-promises'

let localVue = createLocalVue()
let wrapper

describe('components/AppSelector.vue', () => {
  let systemResolve, systemReject
  let mocks = { $t: (t) => t }
  let common = { localVue, mocks }

  describe('created', () => {
    it('apps.fetch.resolve', async () => {
      let apps = [ { id: 'a1', listed: true }, { id: 'a2', unify: { listed: true } }, { id: 'a3', unify: {} } ]
      systemResolve = sinon.stub().resolves(apps)
      wrapper = mount(AppSelector, { ...common, mocks: { ...mocks, $system: { applicationList: systemResolve } } })

      expect(wrapper.vm.err).to.eq(null)
      expect(wrapper.vm.available_apps).to.have.length(0)
      await fp()

      expect(wrapper.vm.err).to.eq(null)
      expect(wrapper.vm.available_apps).to.have.length(2)
      expect(wrapper.vm.available_apps).to.deep.eq([ { id: 'a1', listed: true }, { id: 'a2', unify: { listed: true }, listed: true } ])
    })

    it('apps.fetch.reject', async () => {
      systemReject = sinon.stub().rejects(new Error('reject'))
      wrapper = mount(AppSelector, { ...common, mocks: { ...mocks, $system: { applicationList: systemReject } } })

      expect(wrapper.vm.err).to.eq(null)
      await fp()

      expect(wrapper.vm.err).to.eq('reject')
      expect(wrapper.vm.available_apps).to.have.length(0)
    })
  })

  describe('methods', () => {
    it('addApp', () => {
      systemReject = sinon.stub().rejects(new Error('reject'))
      wrapper = mount(AppSelector, { ...common, mocks: { ...mocks, $logger: { log: (e) => e }, $system: { applicationList: systemReject } } })

      // Disposition
      expect(wrapper.vm.chooseDisposition).to.eq(false)
      expect(wrapper.emitted()['add-app']).to.eq(undefined)

      let availableApp = { id: 'a1' }
      let paneId = 1
      wrapper.vm.addApp(availableApp, null)
      expect(wrapper.vm.chooseDisposition).to.eq(true)
      expect(wrapper.emitted['add-app']).to.eq(undefined)

      // Add app
      wrapper = mount(AppSelector, { ...common, mocks: { ...mocks, $logger: { log: (e) => e }, $system: { applicationList: systemReject } } })
      wrapper.vm.addApp(availableApp, paneId)
      expect(wrapper.vm.chooseDisposition).to.eq(false)
      expect(wrapper.emitted()['add-app'].pop().pop()).to.deep.eq({ app: availableApp, paneId: paneId })
    })
  })
})
