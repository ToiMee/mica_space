(() => {
  const target = document.getElementById('root')
  const spec = window.__micaSpec
  let dictionaries = {}
  let language = navigator.language.startsWith('zh') ? 'zh' : 'en'
  const translate = key => dictionaries[language]?.[key] || dictionaries.en?.[key] || key
  const plugin = spec.factory(id => {
    if (id === 'react') return window.React
    throw new Error('Unexpected client module: ' + id)
  })
  let Component
  plugin.apply({
    effect(callback) { return callback() },
    locale: {
      register(_namespace, value) { dictionaries = value; return () => {} },
      bind() { return translate },
    },
    slots: {
      inject(_name, callback) { return callback() },
      register(options, component) {
        if (options.key === 'chat-space') Component = component
        return () => {}
      },
    },
    layout: {
      selectPanel() {},
      panelInfo: { getSnapshot: () => null, subscribe: () => () => {} },
    },
  })
  window.__micaBridgeReady.then(result => {
    const locale = result?.hostContext?.locale
    if (locale) language = locale.startsWith('zh') ? 'zh' : 'en'
    window.ReactDOM.createRoot(target).render(window.React.createElement(Component, { tr: translate, t: translate }))
  }).catch(error => { target.textContent = 'Mica Space: ' + error.message })
})()
