import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {useMessageBroker, useStorageManager} from "../hooks"

const root = createRoot(document.getElementById("root")!)

const Frame = (): JSX.Element => {
  const [message, setMessage] = useState("")

  const {publish, subscribe, lastEvent} = useMessageBroker({topic: "test"})
  const {getItem} = useStorageManager()

  useEffect(() => {
    subscribe("test", (event:any)=>{
      console.log(getItem("test"))
    })
  }, [])

  const sendMessage = () => {
    publish(message)
  }

  return (
    <div>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          sendMessage()
        }}
      >
        Send
      </button>
      <h1>iFrame2</h1>
      {lastEvent?.message}
    </div>
  )
}

root.render(
  <StrictMode>
    <Frame />
  </StrictMode>
)
