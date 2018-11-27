var domain = 'meet.jit.si'
var urlParams = new URLSearchParams(window.location.search)
var options = {
  roomName: urlParams.get('id') || 'CrustJitsi',
  width: '100%',
  height: '100%',
  parentNode: document.querySelector('#meet'),
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'info', 'recording',
      'settings',
      'videoquality', 'filmstrip', 'invite', 'shortcuts',
    ],
  },
}
var api = new JitsiMeetExternalAPI(domain, options)

document.addEventListener('unload', exitRoom)

function exitRoom () {
  api.dispose()
}
