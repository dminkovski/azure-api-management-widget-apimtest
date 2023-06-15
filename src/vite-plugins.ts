export interface WrapperSettings {
  width?: string
  height?: string
  params?: string
  port?: number
}
export function wrapWidget(settings?: WrapperSettings) {
  let counter = -1

  function getSettings() {
    const defaultSettings = {width: "100%", height: "100%", params: "test=true", port: 3000}
    const appliedSettings = {...defaultSettings, ...settings}
    return appliedSettings
  }

  return {
    name: "wrap-widget",
    transformIndexHtml(html: any, ctx: any) {
      counter++
      if (ctx.path.includes("index") && counter % 2 == 0) {
        const {width, height, params, port} = getSettings()
        return `<body style="margin: auto;text-align: center;"><title>Widget-Wrapper</title><iframe style="width:${width};height:${height}" src="http//:localhost:${port}?${params}" /></body>`
      }
      return html
    },
  }
}
