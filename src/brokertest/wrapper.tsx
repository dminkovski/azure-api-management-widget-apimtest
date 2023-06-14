import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <iframe src="http://localhost:3000/iframe1.html" />
    <iframe src="http://localhost:3000/iframe2.html" />
  </StrictMode>
)
