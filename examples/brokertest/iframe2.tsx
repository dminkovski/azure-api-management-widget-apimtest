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
  const [count, setCount] = useState(6)
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
      let sendCount = 6
      const interval = setInterval(() => {
        setCount(sendCount)
        if (sendCount == 0) {
          clearInterval(interval)

          // Show we have subscribed
          setReadyForAck(true)
          // Subscribe to Topic "ack" using Message Broker and callback with received from AckBroker
          subscribe("ack", (event: any) => {
            received({...event, message: "Widget 2 received it thanks"})
          })
        }
        sendCount--
      }, 1000)

      console.log(`Widget 2 loaded`)
    }
  }, [])

  const sendMessage = () => {
    publish(message)
  }

  return (
    <div>
      <h1>Widget2</h1>
      <h4>Message Broker</h4>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          sendMessage()
        }}
      >
        Send
      </button>
      <br />
      <br />
      <span>
        <b>Received: </b>
        {lastEvent && lastEvent?.message}
      </span>
      <hr />
      <h4>Custom Hook</h4>
      <span>
        <b>Language: </b>
        {JSON.stringify(settings)}
      </span>
      <hr />
      <h4>Ack broker</h4>
      <b>Listener initializes in {count} seconds: </b>
      <br />
      {`${readyForAck}`}
      <br />
      <br />
      {lastEvent && lastEvent?.message}
    </div>
  )
}

root.render(
  <StrictMode>
    <Widget2 />
  </StrictMode>
)
