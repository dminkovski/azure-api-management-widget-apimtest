
import { ViteDevServer, IndexHtmlTransformResult, HtmlTagDescriptor  } from "vite";
import {WrapperSettings} from './widget-wrapper'

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
    const defaultSettings = { width: "100%", height: "100%", params: `editorData=${editorData}`, port: 3000 }
    const appliedSettings = { ...defaultSettings, ...settings }
    return appliedSettings
  }

  return {
    name: 'wrap-widget',
    //apply: 'serve',
    async transformIndexHtml(html: any, ctx: any) {
      const url = ctx.originalUrl
      const vite = ctx.server as ViteDevServer;
      try {
        //TODO: fix this to handle query string params
        if (url == '/' && !framed) {
          framed = true
          //TODO replace fetch with fs
          const template =await fetch('http://localhost:3000/widget-page.html')
          let transform = {
            html:  await template.text(),
            tags: [] as HtmlTagDescriptor[]
          }
          
          transform.tags.push({
             tag: "link",
             attrs: { rel: "stylesheet", type: "text/css", href: `${""}/styles/theme.css` },
             injectTo: "head"
           })
      
           transform.tags.push({
            tag: "script",
            injectTo: "head",
            children: `${getSettings()}` //todo this needs to serialize
          })
        
          return transform;
        }
        return html
      }
      catch (e) {
        vite.ssrFixStacktrace(e)
        throw (e)
      }
    },
  }

}

