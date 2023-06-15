export interface WrapperSettings {
  width?: string
  height?: string
  params?: string
  port?: number
}
export function wrapWidget(settings?: WrapperSettings) {
  let framed = false

  function getSettings() {
    const jsonData = {
      values: {
        label1: "widget",
        instanceId: 1,
        environment: "test",
      },
    }
    const editorData = encodeURIComponent(JSON.stringify(jsonData))
    const defaultSettings = {width: "100%", height: "100%", params: `editorData=${editorData}`, port: 3000}
    const appliedSettings = {...defaultSettings, ...settings}
    return appliedSettings
  }

  return {
    name: "wrap-widget",
    transformIndexHtml(html: any, ctx: any) {
      if (ctx.path.includes("index") && !framed) {
        const {width, height, params, port} = getSettings()
        framed = true
        return `<body style="margin: auto;text-align: center;"><script type="module" src="/src/wrapper.js"></script><title>Widget-Wrapper</title><iframe style="width:${width};height:${height}" src="http//:localhost:${port}?${params}" /></body>`
      }
      framed = false
      return html
    },
  }
}
