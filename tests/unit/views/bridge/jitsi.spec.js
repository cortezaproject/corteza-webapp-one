import { expect, assert } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import Jitsi from '@/views/Bridge/Jitsi'
import sinon from 'sinon'
import fp from 'flush-promises'

let localVue = createLocalVue()
let wrapper

describe('views/Bridge/Jitsi.vue', () => {
  let messagingResolve, messagingReject
  let userID = 'userID'
  let loadScript = sinon.stub().resolves({})

  beforeEach(() => {
    loadScript.resetHistory()
  })

  let mocks = { $t: (t) => t, $auth: { user: { userID } }, loadScript }
  let common = { localVue, mocks }

  describe('beforeCreate', () => {
    it('channels.fetch.resolve', async () => {
      let visible = [
        { type: 'public', members: [ userID, 'notUserID' ] },
        { type: 'private', members: [ userID, 'notUserID' ] },
      ]

      let channels = [
        // Visible
        ...visible,

        // Hidden
        { type: 'public', membershipFlag: 'hidden', members: [ userID, 'notUserID' ] },
        { type: 'private', membershipFlag: 'hidden', members: [ userID, 'notUserID' ] },

        // Not member
        { type: 'public', members: [ 'notUserID' ] },
        { type: 'private', members: [ 'notUserID' ] },

        // Invalid type
        { type: 'invalid', members: [ userID, 'notUserID' ] },
      ]
      messagingResolve = sinon.stub().resolves(channels)

      wrapper = mount(Jitsi, { ...common, mocks: { ...mocks, $messaging: { channelList: messagingResolve } } })
      expect(wrapper.vm.channels).to.have.length(0)

      await fp()
      assert(messagingResolve.calledOnce)
      expect(wrapper.vm.channels).to.have.length(2)
      expect(wrapper.vm.channels).to.deep.eq(visible)
      expect(wrapper.vm.promiseError).to.eq(null)
    })

    it('channels.fetch.reject', async () => {
      messagingReject = sinon.stub().rejects(new Error('reject'))

      wrapper = mount(Jitsi, { ...common, mocks: { ...mocks, $messaging: { channelList: messagingReject } } })
      expect(wrapper.vm.channels).to.have.length(0)

      await fp()
      expect(wrapper.vm.channels).to.have.length(0)
      expect(wrapper.vm.promiseError).to.eq('reject')
    })
  })

  describe('created', () => {
    let loadResolve, loadReject
    messagingReject = sinon.stub().rejects(new Error('reject'))

    beforeEach(() => {
      messagingReject.resetHistory()
    })

    it('script.load.resolve', async () => {
      loadResolve = sinon.stub().resolves({})
      wrapper = mount(Jitsi, { ...common, mocks: { ...mocks, loadScript: loadResolve, $messaging: { channelList: messagingReject } } })

      expect(wrapper.vm.jistsiScriptLoaded).to.eq(false)
      expect(wrapper.vm.jistsiScriptErr).to.eq(null)

      await fp()
      expect(wrapper.vm.jistsiScriptLoaded).to.eq(true)
      expect(wrapper.vm.jistsiScriptErr).to.eq(null)
      assert(loadResolve.calledOnce)
    })

    it('script.load.reject', async () => {
      loadReject = sinon.stub().rejects(new Error('reject'))
      wrapper = mount(Jitsi, { ...common, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

      expect(wrapper.vm.jistsiScriptLoaded).to.eq(false)
      expect(wrapper.vm.jistsiScriptErr).to.eq(null)

      await fp()
      expect(wrapper.vm.jistsiScriptLoaded).to.eq(false)
      expect(wrapper.vm.jistsiScriptErr).to.eq('reject')
      assert(loadReject.calledOnce)
    })
  })

  describe('destroyed', () => {
    it('dispose', () => {
      let dispose = sinon.fake()
      let loadReject = sinon.stub().rejects(new Error('reject'))
      wrapper = mount(Jitsi, { ...common, methods: { dispose }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

      assert(dispose.notCalled)
      wrapper.destroy()
      assert(dispose.calledOnce)
    })
  })

  describe('methods', () => {
    let loadReject

    beforeEach(() => {
      loadReject = sinon.stub().rejects(new Error('reject'))
    })

    describe('dispose', () => {
      it('jitsi.defined', () => {
        let dispose = sinon.fake()
        wrapper = mount(Jitsi, { ...common, data: () => ({ jitsi: { dispose } }), mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

        expect(wrapper.vm.jitsi).to.not.eq(null)
        wrapper.vm.dispose()
        assert(dispose.calledOnce)
        expect(wrapper.vm.jitsi).to.eq(null)
      })

      it('jitsi.undefined', () => {
        wrapper = mount(Jitsi, { ...common, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

        expect(wrapper.vm.jitsi).to.eq(null)
        wrapper.vm.dispose()
        expect(wrapper.vm.jitsi).to.eq(null)
      })
    })

    it('cleanup', () => {
      let unclean = 'aA.,-_*?=) (/&%$#12'
      let clean = 'aA12'
      expect(Jitsi.methods.cleanup(unclean)).to.eq(clean)
    })

    it('onJoin', () => {
      // user.name
      let open = sinon.fake()
      wrapper = mount(Jitsi, { ...common, data: () => ({ channelID: 'channelID' }), methods: { open }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject }, $auth: { user: { name: 'name' } } } })

      wrapper.vm.onJoin()
      expect(open.calledOnceWith({ roomName: 'channelID', userDisplayName: 'name' }))

      // user.email
      open.resetHistory()
      wrapper = mount(Jitsi, { ...common, data: () => ({ channelID: 'channelID' }), methods: { open }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject }, $auth: { user: { email: 'email' } } } })

      wrapper.vm.onJoin()
      expect(open.calledOnceWith({ roomName: 'channelID', userDisplayName: 'email' }))
    })

    it('onCreate', () => {
      // user.name
      let open = sinon.fake()
      wrapper = mount(Jitsi, { ...common, data: () => ({ roomName: 'roomName' }), methods: { open }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject }, $auth: { user: { name: 'name' } } } })

      wrapper.vm.onJoin()
      expect(open.calledOnceWith({ roomName: 'roomName', userDisplayName: 'name' }))

      // user.email
      open.resetHistory()
      wrapper = mount(Jitsi, { ...common, data: () => ({ roomName: 'roomName' }), methods: { open }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject }, $auth: { user: { email: 'email' } } } })

      wrapper.vm.onJoin()
      expect(open.calledOnceWith({ roomName: 'roomName', userDisplayName: 'email' }))
    })

    it('onClose', () => {
      let dispose = sinon.fake()
      wrapper = mount(Jitsi, { ...common, methods: { dispose }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

      wrapper.vm.onClose()
      assert(dispose.calledOnce)
    })

    it('removeJitsiAfterHangup', () => {
      let dispose = sinon.fake()
      wrapper = mount(Jitsi, { ...common, methods: { dispose }, mocks: { ...mocks, loadScript: loadReject, $messaging: { channelList: messagingReject } } })

      wrapper.vm.removeJitsiAfterHangup()
      assert(dispose.calledOnce)
    })

    it('open')
  })
})
