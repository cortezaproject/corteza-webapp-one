import { expect } from 'chai'
import Avatar from '@/components/Avatar'

describe('components/Avatar.vue', () => {
  describe('computed', () => {
    it('letter', () => {
      let local = { user: {} }
      expect(Avatar.computed.letter.call(local)).to.eq('')

      local = { user: { email: 'email' } }
      expect(Avatar.computed.letter.call(local)).to.eq('E')

      local = { user: { email: 'email', username: 'username' } }
      expect(Avatar.computed.letter.call(local)).to.eq('U')

      local = { user: { email: 'email', username: 'username', name: 'name' } }
      expect(Avatar.computed.letter.call(local)).to.eq('N')
    })
  })
})
