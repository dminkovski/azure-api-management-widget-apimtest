import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {useAckBroker, useMessageBroker, useStorageManager} from "../../src/hooks"
import {useSettings} from "./custom-hook"

const root = createRoot(document.getElementById("root")!)

/**
 * Example using the provided Hooks
 * @returns JSX.Element
 */
const Widget2 = (): JSX.Element => {
  const [message, setMessage] = useState("")
  const [readyForAck, setReadyForAck] = useState(false)

  const init = useRef(false)

  const {publish, subscribe, lastEvent} = useMessageBroker({topic: "test"})
  const {received} = useAckBroker()
  const {settings} = useSettings()

  useEffect(() => {
    if (!init.current) {
      init.current = true

      subscribe()

      // Mimic late initialize for asynchrunous Ack Test
      // Increase Timeout from 3000 to 10000 to see error
      setTimeout(() => {
        setReadyForAck(true)
        subscribe("ack", (event: any) => {
          received({...event, message: "Widget 2 received it thanks"})
        })
      }, 3000)

      console.log(`Widget 2 loaded`)
    }
  }, [])

  const sendMessage = () => {
    publish(message)
  }

  return (
    <div>
      <h1>Widget2</h1>
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
      <br />
      <b>Ready For Ack: </b>
      {`${readyForAck}`}
    </div>
  )
}

root.render(
  <StrictMode>
    <Widget2 />
  </StrictMode>
)
