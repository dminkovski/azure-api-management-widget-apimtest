import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {
  MessageBroker,
  ChannelEvent,
} from "../../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/messagebroker"
import {StorageManager} from "../../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/storagemanager"
import {useSettings} from "../hooks"

const root = createRoot(document.getElementById("root")!)

const Frame = (): JSX.Element => {
  const brokerRef = useRef<MessageBroker | null>(null)
  const [message, setMessage] = useState("")
  const [received, setReceived] = useState("")

  const storageRef = useRef<StorageManager | null>(null)

  const {update, reset, settings} = useSettings()

  useEffect(() => {
    if (!brokerRef.current) {
      brokerRef.current = new MessageBroker()
      storageRef.current = new StorageManager()
      const success = brokerRef?.current?.subscribe("test", (event: ChannelEvent) => {
        setReceived(`Received from ${event.sender}: ${event.message}`)
      })
      console.log("iframe 1 subscribed", success)
    }
  }, [])
  const sendMessage = () => {
    brokerRef?.current?.publish("test", message)
    storageRef?.current?.setItem("test", "msft")
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
