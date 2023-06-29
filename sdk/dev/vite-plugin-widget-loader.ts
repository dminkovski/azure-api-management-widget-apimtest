
import { ViteDevServer, IndexHtmlTransformResult, HtmlTagDescriptor } from "vite";
import { ValuesCommon } from "@azure/api-management-custom-widgets-tools";
import { WidgetWrapperOptions, defaultOptions } from './widget-wrapper'
import { getWidgetConfig } from '../utils/common.js'
import * as fs from 'fs';
import * as path from 'path'



export function wrapWidget<Values extends ValuesCommon>(options: WidgetWrapperOptions, widgetValues: Values) {
  let framed = false

  function getSettings() {
    const widgetConfig = getWidgetConfig()

    const editorData = {
      values: widgetValues,
      instanceId: `${widgetConfig.name}_local`,
      environment: "local"
    }

    let port = 3000;

    const extendedOptions = 
    {
      name: widgetConfig.name,
      instanceId: editorData.instanceId,
      src: `http//:localhost:${port}?editorData=${encodeURIComponent(JSON.stringify(editorData))}`
    }

    return { ...defaultOptions, ...options, ...extendedOptions }
  }

  return {
    name: 'wrap-widget',
    //enforce: 'post',
    //apply: 'serve',
    async transformIndexHtml(html: any, ctx: any) {
      const url = ctx.originalUrl
      const vite = ctx.server as ViteDevServer;
      try {
        //TODO: fix this to handle query string params
        //need a better way to see what's being loaded
        if (url == '/' && !framed) {
          //framed = true
          const settings = getSettings();

          const template = fs.readFileSync(
            path.resolve('./sdk/dev/widget-page.html'),
            'utf-8',
          )

          let transform = {
            html: template,
            tags: [] as HtmlTagDescriptor[]
          }
          if (settings.portalStyles) {
            transform.tags.push({
              tag: "link",
              attrs: {
                rel: "stylesheet",
                type: "text/css",
                href: new URL('/styles/theme.css', settings.developerPortalUrl).toString()
              },
              injectTo: "head"
            })
          }

          transform.tags.push({
            tag: "script",
            injectTo: "body-prepend",
            children: `options = ${JSON.stringify(settings)}`
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

