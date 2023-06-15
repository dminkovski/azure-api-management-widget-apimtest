import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <div style={{display: "flex", height: "100vh"}}>
      <iframe style={{width: "50%", height: "100vh"}} src="http://localhost:3000/examples/iframe1.html" />
      <iframe style={{width: "50%", height: "100vh"}} src="http://localhost:3000/examples/iframe2.html" />
    </div>
  </StrictMode>
)
