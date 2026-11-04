(function () {
  const spec = window.__micaSpec
  if (!spec) throw new Error('Mica client bundle did not register')
  let dictionaries = { zh: {}, en: {} }
  const translate = (key) => (dictionaries.zh && dictionaries.zh[key]) || key
  const plugin = spec.factory((id) => {
    if (id === 'react') return window.React
    throw new Error('Unexpected client module: ' + id)
  })
  const registrations = []
  const ctx = {
    effect: (fn) => { fn(); return () => {} },
    locale: {
      register: (_ns, value) => { dictionaries = value; return () => {} },
      bind: () => translate,
    },
    slots: {
      inject: (_name, callback) => { callback(); return () => {} },
      register: (options, component) => { registrations.push({ options, component }); return () => {} },
    },
    layout: {
      selectPanel: () => {},
      panelInfo: { getSnapshot: () => ({ activePanelId: null }), subscribe: () => () => {} },
    },
  }
  plugin.apply(ctx)
  const registration = registrations.find((entry) => entry.options.key === 'chat-space')
  if (!registration) throw new Error('Mica main panel was not registered')
  const Root = registration.component
  const root = window.ReactDOM.createRoot(document.getElementById('root'))
  root.render(window.React.createElement(Root, {
    tr: translate,
    t: translate,
    onBackToConversation: () => {},
  }))
  window.__micaReady = true
})()
