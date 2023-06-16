import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {useAckBroker, useMessageBroker, useStorageManager} from "../../src/hooks"
import {useSettings} from "./custom-hook"

const root = createRoot(document.getElementById("root")!)

/**
 * Example using the provided Hooks
 * @returns JSX.Element
 */
const Frame = (): JSX.Element => {
  const [message, setMessage] = useState("")
  const init = useRef(false)

  const {publish, subscribe, lastEvent} = useMessageBroker({topic: "test"})
  const {received} = useAckBroker()
  const {getItem} = useStorageManager()
  const {settings} = useSettings()

  useEffect(() => {
    if (!init.current) {
      init.current = true

      subscribe("test", (event: any) => {
        console.log(getItem("test"))
      })

      setTimeout(() => {
        subscribe("ack", (event: any) => {
          console.log("iframe 2 received", event)
          received(event)
        })
      }, 3000)
    }
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
