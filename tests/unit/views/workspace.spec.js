import { expect, assert } from 'chai'
import { mount, writeableWindowLocation } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import Workspace from '@/views/Workspace'
import sinon from 'sinon'
import fp from 'flush-promises'

let wrapper
let localVue = createLocalVue()

describe('views/Workspace.vue', () => {
  beforeEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('hasPanes', () => {
      let local = { $store: { state: { panes: { items: [] } } } }
      expect(Workspace.computed.hasPanes.get.call(local)).to.eq(false)

      local = { $store: { state: { panes: { items: [{}] } } } }
      expect(Workspace.computed.hasPanes.get.call(local)).to.eq(true)
    })
  })

  describe('created', () => {
    beforeEach(() => {
      writeableWindowLocation()
    })

    let systemResolve, systemReject
    it('auth.check.valid', async () => {
      systemResolve = sinon.stub().resolves({ message: 'message' })
      wrapper = mount(Workspace, { localVue, mocks: { $auth: { is: () => false, check: systemResolve }, $system: {} } })

      expect(window.location).to.eq('/')

      await fp()
      expect(window.location).to.eq('/')
      assert(systemResolve.calledOnceWith({}))
    })

    it('auth.check.invalid', async () => {
      systemReject = sinon.stub().rejects(new Error('reject'))
      wrapper = mount(Workspace, { localVue, mocks: { $auth: { is: () => false, check: systemReject }, $system: {} } })

      expect(window.location).to.eq('/')

      await fp()
      expect(window.location).to.eq('/auth')
      assert(systemReject.calledOnceWith({}))
    })
  })

  describe('methods', () => {
    let systemResolve = sinon.stub().resolves()
    let log = sinon.fake()
    let commit = sinon.fake()
    it('addTab', () => {
      wrapper = mount(Workspace, { localVue, mocks: { $auth: { is: () => false, check: systemResolve }, $system: {}, $logger: { log }, $store: { commit } } })
      let appData = { id: 'app1' }

      wrapper.vm.addTab(appData)
      assert(log.calledTwice)
      assert(commit.calledOnceWith('panes/addApp', appData))
    })
  })
})
