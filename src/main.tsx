import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

import "./styles/app.scss"
import {SecretsProvider, WidgetDataProvider} from "./providers"
import KeyvaultAccess from "./app/keyvault"

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <WidgetDataProvider>
      <SecretsProvider targetModule="app">
        <KeyvaultAccess />
      </SecretsProvider>
    </WidgetDataProvider>
  </StrictMode>
)
