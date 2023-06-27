
import { ViteDevServer, IndexHtmlTransformResult, HtmlTagDescriptor  } from "vite";
import {Mustache} from 'mustache'

export interface WrapperSettings {
  width?: string
  height?: string
  params?: string
  port?: number
}
export const iframeSandboxAllows = "allow-scripts allow-modals allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-presentation allow-orientation-lock allow-pointer-lock";

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

  async function transformTemplate(): Promise<string>
  {
    return fetch('template.html.mustache')
      .then((response) => response.text())
      .then((template) => {
        return Mustache.render(template, { iframeSandboxAllows, getSettings() });  
      });

  }

  async function render(url: string) : Promise<IndexHtmlTransformResult>  {
    const settings = getSettings() 
    let result = {
      html:  await transformTemplate(),
      tags: [] as HtmlTagDescriptor[]
    }
    
    //TODO: Make loading site styles an option
    //Inject dev portal path.  My thinking is that mustache generates the page once
    //on startup, and you have the option to turn behaviors on/off via the query
    
    // result.tags.push({
    //   tag: "link",
    //   attrs: { rel: "stylesheet", type: "text/css", href: "/styles/theme.css" },
    //   injectTo: "head"
    // })

    // result.tags.push({
    //   tag: "script",
    //   attrs: { src: "/scripts/theme.js" },
    //   injectTo: "head"
    // })
  
    return result;
  }

  return {
    name: 'wrap-widget',
    //apply: 'serve',
    async transformIndexHtml(html: any, ctx: any) {
      const url = ctx.originalUrl
      const vite = ctx.server as ViteDevServer;
      try {
        //TODO: fix this to handle query string
        if (url == '/' && !framed) {
          framed = true
          return render(url);
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

