import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import Index from '@/views/Index'

let localVue = createLocalVue()

describe('views/Index.vue', () => {
  it('mounts', () => {
    mount(Index, { localVue, stubs: ['router-multi-view'] })
  })
})
