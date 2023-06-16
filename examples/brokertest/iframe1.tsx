import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {MessageBroker, ChannelEvent} from "@widget-tools/messagebroker"
import {StorageManager} from "@widget-tools/storagemanager"
import {AckBroker} from "@widget-tools/ackbroker"

import {useSettings} from "./custom-hook"

const root = createRoot(document.getElementById("root")!)
/**
 * Example without using Hooks and using the MessageBroker, StorageManager and AckBroker directly
 * @returns JSX.Element
 */
const Frame = (): JSX.Element => {
  const [message, setMessage] = useState("")
  const [received, setReceived] = useState("")

  const brokerRef = useRef<MessageBroker | null>(null)
  const storageRef = useRef<StorageManager | null>(null)
  const ackbrokerRef = useRef<AckBroker | null>(null)

  // Own custom hook
  const {update, reset, settings} = useSettings()

  useEffect(() => {
    if (!brokerRef.current) {
      brokerRef.current = new MessageBroker()
      storageRef.current = new StorageManager()
      ackbrokerRef.current = new AckBroker()

      const success = brokerRef?.current?.subscribe("test", (event: ChannelEvent) => {
        setReceived(`Received from ${event.sender}: ${event.message}`)
      })
      console.log("iframe 1 subscribed", success)
    }
  }, [])
  const sendMessage = () => {
    brokerRef?.current?.publish({topic: "test", message})
    storageRef?.current?.setItem("storage-test", "iframe1")
    ackbrokerRef?.current?.send(
      {
        topic: "ack",
        message: "Ack From Widget1",
      },
      (response: any) => {
        console.log("iframe 1 ack", response)
      }
    )
  }
  const setLanguage = (language: string) => {
    update({
      language,
    })
  }
  return (
    <div>
      <h1>iFrame1</h1>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          sendMessage()
        }}
      >
        Send
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
    </div>
  )
}

root.render(
  <StrictMode>
    <Frame />
  </StrictMode>
)
