var domain = 'meet.jit.si'
var urlParams = new URLSearchParams(window.location.search)
var options = {
  roomName: urlParams.get('id') || 'CrustJitsi',
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
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'info', 'recording',
      'settings', 'tileview', 'videoquality', 'filmstrip', 'invite',
      'shortcuts',
    ],
    SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
  },
}
var api = new JitsiMeetExternalAPI(domain, options)

document.addEventListener('unload', exitRoom)

function exitRoom() {
  api.dispose()
}

