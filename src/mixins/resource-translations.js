export default {
  computed: {
    currentLanguage () {
      return this.$i18n.i18next.language
    },

    /**
     * Manage directionality of the page according to the language
     *  - Arabic (ar)
     *  - Hebrew (he)
     *  - Pashto (pa)
     *  - Persian (fa)
     *  - Urdu (ur)
     *  - Sindhi (sd)
     * @returns {string} rtl | ltr
     */
    textDirectionality () {
      switch (this.currentLanguage) {
        case 'ar':
        case 'he':
        case 'pa':
        case 'fa':
        case 'ur':
        case 'sd':
          return 'rtl'
        default:
          return 'ltr'
      }
    },
  },
}
