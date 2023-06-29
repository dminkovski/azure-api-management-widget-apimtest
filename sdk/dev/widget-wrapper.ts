/**
 * This provides a wrapper for previewing and debugging a widget locally
 * used by the vite plugin
 */
import { APIM_ASK_FOR_SECRETS_MESSAGE_KEY, Secrets } from "@azure/api-management-custom-widgets-tools";

export const iframeSandboxAllows = "allow-scripts allow-modals allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-presentation allow-orientation-lock allow-pointer-lock";

export interface WidgetWrapperOptions {
  
}

export interface WrapperSettings {
  width?: string 
  height?: string
  params?: string //widget values, if overriden
  port?: number //vite port number, if overridden
  developerPortalUrl: string 
  startPage?: string //a specific page to lauch, rather than the root
  impersonateUserId?: string // "1" for admin, which is normally sufficient
  portalStyles: boolean //true = link the css from the live developer portal
}
export function init() {
  window.addEventListener("message", async (msg: { data: any; source: any; }) => {
      console.log("Received message in wrapper:", msg.data)
      if (msg.source) {
        msg!.source.postMessage(
          {
            [APIM_ASK_FOR_SECRETS_MESSAGE_KEY]: {
              test: true,
              managementApiUrl: "localhost",
            }
          },
          "*"
        )
      }
    });
  }
