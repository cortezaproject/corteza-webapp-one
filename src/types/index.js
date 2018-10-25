export function User (u) {
  if (!u) {
    return {}
  }

  this.ID = u.ID || u.id // cover both cases (BC)
  this.username = u.username
  this.handle = u.handle
  this.name = u.name
  this.avatar = u.avatar || 'https://placekitten.com/100/100'
  this.connections = u.connections || 0
}

export function Member (m) {
  if (!m) {
    return
  }

  this.user = new User(m.user)
  this.type = m.type
  this.channelID = m.channelID
  this.createdAt = m.createdAt || null
  this.updatedAt = m.updatedAt || null
}
