import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import NoApp from '@/views/NoApp'

let localVue = createLocalVue()

describe('views/NoApp.vue', () => {
  it('mounts', () => {
    mount(NoApp, { localVue, mocks: { $route: { path: 'path' } } })
  })
})
