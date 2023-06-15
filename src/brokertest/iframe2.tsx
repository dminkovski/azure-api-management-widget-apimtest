import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {useMessageBroker, useStorageManager, useSettings} from "../hooks"

const root = createRoot(document.getElementById("root")!)

const Frame = (): JSX.Element => {
  const [message, setMessage] = useState("")

  const {publish, subscribe, lastEvent} = useMessageBroker({topic: "test"})
  const {getItem} = useStorageManager()
  const {settings} = useSettings()

  useEffect(() => {
    subscribe("test", (event: any) => {
      console.log(getItem("test"))
    })
  }, [])

  const sendMessage = () => {
    publish(message)
  }

  return (
    <div>
      <h1>iFrame2</h1>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          sendMessage()
        }}
      >
        Send
      </button>
      <hr />
      <span>
        <b>Received: </b>
        {lastEvent?.message}
      </span>
      <br />
      <span>
        <b>Language: </b>
        {JSON.stringify(settings)}
      </span>
    </div>
  )
}

root.render(
  <StrictMode>
    <Frame />
  </StrictMode>
)
