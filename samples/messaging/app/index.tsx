import React, {StrictMode} from "react"
import {createRoot} from "react-dom/client"

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <div style={{display: "flex", height: "100vh"}}>
      <iframe
        allow="clipboard-read; clipboard-write; camera; microphone; geolocation"
        sandbox="allow-scripts allow-modals allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-top-navigation allow-presentation allow-orientation-lock allow-pointer-lock"
        style={{width: "50%", height: "100vh"}}
        src="./app/iframe1.html"
      />
      <iframe
        allow="clipboard-read; clipboard-write; camera; microphone; geolocation"
        sandbox="allow-scripts allow-modals allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-top-navigation allow-presentation allow-orientation-lock allow-pointer-lock"
        style={{width: "50%", height: "100vh"}}
        src="./app/iframe2.html"
      />
    </div>
  </StrictMode>
)
