import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {MessageBroker, ChannelEvent} from "@widget-tools/messagebroker"
import {StorageManager} from "@widget-tools/storagemanager"
import {AckBroker} from "@widget-tools/ackbroker"

import {useSettings} from "./custom-hook"

const root = createRoot(document.getElementById("root")!)
/**
 * Example Widget without using Hooks and using the MessageBroker, StorageManager and AckBroker directly using Refs
 * @returns JSX.Element
 */
const Widget1 = (): JSX.Element => {
  const [message, setMessage] = useState("")
  const [received, setReceived] = useState("")
  const [ackMessage, setAckMessage] = useState("")

  const brokerRef = useRef<MessageBroker | null>(null)
  const storageRef = useRef<StorageManager | null>(null)
  const ackbrokerRef = useRef<AckBroker | null>(null)

  // Own custom hook Example
  const {update, reset} = useSettings()

  useEffect(() => {
    // Initialize all objects exactly once during rerender
    if (!brokerRef.current) {
      // Message Broker for publishing and subscribing
      brokerRef.current = new MessageBroker()
      // Storage Manager for storing data in sessionStorage or localStorage
      storageRef.current = new StorageManager()
      // AckBroker for verified sending of messages to other widgets
      ackbrokerRef.current = new AckBroker()

      // Subscribe to Topic "test" to receive messages from widget2
      const success = brokerRef?.current?.subscribe("test", (event: ChannelEvent) => {
        setReceived(`Received from ${event.sender}: ${event.message}`)
      })

      // Example of settings storage
      storageRef?.current?.setItem("storage-test", "widget1 loaded")

      console.log(`Widget 1 loaded & subscribed : ${success}`)
    }
  }, [])

  // Send message from state to other widgets on topic "test"
  const publish = () => {
    brokerRef?.current?.publish({topic: "test", message})
  }

  // Use custom settings Hook to store language in session and publish to widgets
  const setLanguage = (language: string) => {
    update({
      language,
    })
  }

  // Send a message with ack (includes retries) and with callback
  const verifiedSend = async () => {
    const response = await ackbrokerRef?.current
      ?.send({
        topic: "ack",
        message: "Ack From Widget1",
      })
      .catch((e: Error) => {
        console.log(e)
        setAckMessage(e.message)
      })
    if (response && response.message) {
      setAckMessage(response.message)
    }
  }

  return (
    <div>
      <h1>Widget1</h1>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          publish()
        }}
      >
        Publish
      </button>
      <br />
      <label>Set Language: </label>
      <select onChange={event => setLanguage(event.target.value)}>
        <option>English</option>
        <option>French</option>
      </select>
      <button
        onClick={() => {
          reset()
        }}
      >
        Reset
      </button>
      <hr />
      <span>
        <b>Received: </b>
        {received}
      </span>
      <br />
      <h5>Send with Ack (while Widget 2 shows "false")</h5>
      <button
        onClick={() => {
          verifiedSend()
        }}
      >
        Send With Ack
      </button>
      <br />
      {ackMessage}
    </div>
  )
}

root.render(
  <StrictMode>
    <Widget1 />
  </StrictMode>
)
