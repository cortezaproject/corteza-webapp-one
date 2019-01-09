var domain = 'meet.jit.si'
var urlParams = new URLSearchParams(window.location.search)
var options = {}
var api, room, user

document.addEventListener('DOMContentLoaded', function () {

  room = urlParams.get('id') || 'CrustJitsi'
  user = urlParams.get('user') || 'me'

  ListJitsiRooms()

});

document.addEventListener('unload', exitRoom)

function exitRoom() {
  api.dispose()
}

function LoadJitsiRoom(room, user) {
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

function SelectRoomClick(room) {
  document.getElementById("roomselection").style.display = "none"
  LoadJitsiRoom(room, user)
}

function ListJitsiRooms() {
  var roomlist = ['crustroom1', 'crustroom2', 'crustroom3']
  var list = "<div id='roomlist'><ul>"
  list += "<li onClick='SelectRoomClick(\"" + roomlist[0] + "\")'>Room 1</li>"
  list += "<li onClick='SelectRoomClick(\"" + roomlist[1] + "\")'>Room 2</li>"
  list += "<li onClick='SelectRoomClick(\"" + roomlist[2] + "\")'>Room 3</li>"
  list += "</ul></div>"

  ReplaceElementContentByID('roomlist', list)
}

function ReplaceElementContentByID(id, content) {
  var Obj = document.getElementById(id); //any element to be fully replaced

  if (Obj.outerHTML) { //if outerHTML is supported
    Obj.outerHTML = content; ///it's simple replacement of whole element with contents of str var
  }
  else { //if outerHTML is not supported, there is a weird but crossbrowsered trick
    var tmpObj = document.createElement("div");
    tmpObj.innerHTML = '<!--THIS DATA SHOULD BE REPLACED-->';
    ObjParent = Obj.parentNode; //Okey, element should be parented
    ObjParent.replaceChild(tmpObj, Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
    ObjParent.innerHTML = ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>', content);
  }
}
