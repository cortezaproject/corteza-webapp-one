var domain = 'meet.jit.si' // 'localhost:8443' // 
var urlParams = new URLSearchParams(window.location.search)
var options = {}
var api, room, user, crustMessageChannels, channels

document.addEventListener('DOMContentLoaded', function () {
  room = urlParams.get('id') || 'CrustJitsi'
  user = urlParams.get('user') || 'me'

  // see if storage has list of crust rooms
  crustMessageChannels = JSON.parse(localStorage.getItem('crustMessagingChannels'))
  // console.log(crustMessageChannels)
  channels = []
  crustMessageChannels.forEach(function (channel) {
    if (channel.type === 'public' && channel.canJoin === true) {
      var ch = {
        id: channel.ID,
        name: channel.name.substring(0, 45),
        value: channel.name.substring(0, 30).replace(/\(.+?\)/g, '').replace(/[^a-z0-9+]+/gi, ''),
        memberCount: channel.members.length,
      }
      channels.push(ch)
    }
  })

  ListJitsiRooms()
})

document.addEventListener('unload', exitRoom)

function exitRoom () {
  api.dispose()
}

function LoadJitsiRoom (room, user) {
  options = {
    roomName: room,
    width: '100%',
    height: '100%',
    parentNode: document.querySelector('#meet'),
    interfaceConfigOverwrite: {
      DEFAULT_BACKGROUND: '#232323',
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      BRAND_WATERMARK_LINK: '',
      SHOW_POWERED_BY: false,
      DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Cruster',
      DEFAULT_LOCAL_DISPLAY_NAME: user,
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'info', 'recording',
        'settings', 'tileview', 'videoquality', 'filmstrip', 'invite',
        'shortcuts',
      ],
      SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
    },
  }
  api = new JitsiMeetExternalAPI(domain, options)
}

function SelectRoomClick (room) {
  document.getElementById('roomselection').style.display = 'none'
  LoadJitsiRoom(room, user)
}

function SelectRoomDropdown (item) {
  document.getElementById('roomselection').style.display = 'none'
  LoadJitsiRoom(item.value, user)
}

function SubmitRoomCreator () {
  room = 'crust' + document.getElementById('roomInputField').value.replace(/\(.+?\)/g, '').replace(/[^a-z0-9+]+/gi, '')
  document.getElementById('roomselection').style.display = 'none'
  LoadJitsiRoom(room, user)
}

function ListJitsiRooms() {
  var list = '<div id="roomdropdown"><select id="roomdropdownselect" onchange="SelectRoomDropdown(this)">'
  list += '<option value="">Select a room</option>'
  channels.forEach(function (channel) {
    list += '<option value="crust' + channel.value + '">' + channel.name + '</option>'
  })
  list += '</select></div>'

  ReplaceElementContentByID('roomdropdown', list)
}

function ReplaceElementContentByID (id, content) {
  var Obj = document.getElementById(id) // any element to be fully replaced

  if (Obj.outerHTML) { // if outerHTML is supported
    Obj.outerHTML = content /// it's simple replacement of whole element with contents of str var
  } else { // if outerHTML is not supported, there is a weird but crossbrowsered trick
    var tmpObj = document.createElement('div')
    tmpObj.innerHTML = '<!--THIS DATA SHOULD BE REPLACED-->'
    var ObjParent = Obj.parentNode // Okey, element should be parented
    ObjParent.replaceChild(tmpObj, Obj) // here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
    ObjParent.innerHTML = ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>', content)
  }
}
