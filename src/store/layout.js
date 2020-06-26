const MAX = 4
const LOCAL_STORAGE_KEY = 'one.layout'

/**
 * Clone object
 */
function C (i) {
  return JSON.parse(JSON.stringify(i))
}

/**
 * Sanitize panel objects, set defaults
 */
function sanitizePanelInput (panels = []) {
  /**
   * Default panel props
   */
  const dp = {
    sticky: false,
    width: undefined,
    height: undefined,
    activeTabIndex: 0,
    tabs: [{}],
  }

  if (!Array.isArray(panels)) {
    panels = []
  }

  const out = [{}, {}, {}, {}]
  for (let index = 0; index < MAX; index++) {
    let { tabs = [{}], visible, ...panel } = (panels[index] || {})
    out[index] = C({
      index,
      // First panel is always visible!
      visible: visible || index === 0,
      ...dp,
      ...panel,
      tabs,
    })
  }

  return out
}

const defaultTabs = [
  { title: 'Messaging', icon: '/applications/default_icon.png', url: '/messaging' },
]

const defaultPanels = sanitizePanelInput([
  { visible: true, tabs: defaultTabs },
])

const getters = {
  loaded (state) {
    return state.loaded
  },

  panels (state) {
    return state.panels
  },

  visiblePanels (state) {
    return state.panels
      .filter(({ visible }) => visible)
      .slice(0, state.panelsEnabled ? MAX : 1)
  },

  visibilityMask (state) {
    return state.panels.map(({ visible }) => visible ? '1' : '0').join('')
  },

  panelsEnabled (state) {
    return state.panelsEnabled
  },

  panel (state) {
    return (index) => state.panels[index]
  },
}

const actions = {
  set ({ commit, state }, { panels = [] }) {
    sanitizePanelInput(panels)
      .forEach(panel => commit('updatePanel', panel))
  },

  /**
   * Expects mask in form of a string
   *
   * Mask should be 4 chars long.
   * Char '1' represents visible layout
   */
  applyVisibilityMask ({ commit, getters }, mask = '0000') {
    // Apply mask to 2nd, 3rd and 4th panel only!
    // 1st one is always visible
    for (let p = 1; p < MAX; p++) {
      commit('updatePanel', {
        ...getters.panel(p),
        visible: mask && mask[p] === '1',
      })
    }
  },

  togglePanelVisibility ({ commit, getters }, { panelIndex, visible }) {
    commit('updatePanel', { ...getters.panel(panelIndex), visible })
  },

  setPanelSize ({ commit, getters }, { panelIndex, width, height }) {
    commit('updatePanel', { ...getters.panel(panelIndex), width, height })
  },

  addTab ({ commit, getters }, { panelIndex, tab = {} }) {
    const panel = C(getters.panel(panelIndex))
    if (!panel.tabs) {
      panel.tabs = []
    }

    panel.tabs.push(tab)

    // Activate the tab
    panel.activeTabIndex = panel.tabs.length - 1

    commit('updatePanel', panel)
  },

  updateTab ({ commit, getters }, { panelIndex, tabIndex, tab }) {
    const panel = C(getters.panel(panelIndex))

    if (!panel.tabs || tabIndex < 0 || panel.tabs.length < tabIndex) {
      throw new RangeError('tab index out of range')
    }

    panel.tabs.splice(tabIndex, 1, tab)

    commit('updatePanel', panel)
  },

  removeTab ({ commit, getters }, { panelIndex, tabIndex }) {
    const panel = C(getters.panel(panelIndex))

    if (!panel.tabs || tabIndex < 0 || panel.tabs.length < tabIndex) {
      throw new RangeError('tab index out of range')
    }

    panel.tabs.splice(tabIndex, 1)

    if (panel.tabs.length === 0) {
      // Make sure we always have 1 tab
      panel.tabs = [{}]
    }

    // Activate left-side tab if possible
    const l = panel.tabs.length - 1
    panel.activeTabIndex = l === 0 ? l : l

    commit('updatePanel', panel)
  },

  activateTab ({ commit, getters }, { panelIndex, tabIndex }) {
    const panel = C(getters.panel(panelIndex))
    if (tabIndex < 0 || panel.tabs.length < tabIndex) {
      throw new RangeError('tab index out of range')
    }

    if (panel.activeTabIndex !== tabIndex) {
      panel.tabs[tabIndex].loaded = true
      panel.activeTabIndex = tabIndex
      // Activate tab will return true if any tab was activated
      commit('updatePanel', panel)
    }
  },

  markTabAsLoaded ({ commit, getters }, { panelIndex, tabIndex }) {
    const panel = C(getters.panel(panelIndex))
    if (tabIndex < 0 || panel.tabs.length < tabIndex) {
      throw new RangeError('tab index out of range')
    }

    if (!panel.tabs[tabIndex].loaded) {
      panel.tabs[tabIndex].loaded = true
      commit('updatePanel', panel)
    }
  },
}

export default ({ localStorage }) => {
  let state = {
    // Self explanatory
    panelsEnabled: true,

    // List of panels and tabs
    panels: C(defaultPanels),

    // To keep track if state has been loaded
    // (for example, from local storage), to prevent
    // overwrite.
    loaded: false,
  }

  if (localStorage && localStorage.getItem) {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (item) {
      try {
        if (item) {
          // Parse if we found anything in lcoal storage
          const parsed = JSON.parse(item)
          if (parsed.panels) {
            parsed.panels = sanitizePanelInput(parsed.panels)
          }

          // Merge loaded state
          state = {
            ...state,
            ...parsed,
            loaded: true,
          }
        }
      } catch (e) {}
    }
  }

  return {
    namespaced: true,

    getters,
    actions,
    state,

    mutations: {
      updatePanel (state, panel) {
        state.panels.splice(panel.index, 1, panel)

        if (localStorage && localStorage.setItem) {
          // If local storage is enabled, extract
          // props that we want to keep
          const { panelsEnabled } = state
          const panels = C(state.panels).map(({ tabs, ...panel }) => ({
            ...panel,

            // Copy all tab info but "loaded" flag
            tabs: tabs.map(({ loaded, ...tab }) => tab),
          }))

          // Make sure we do not store session-variables
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            panelsEnabled,
            panels,
          }))
        }
      },
    },
  }
}
