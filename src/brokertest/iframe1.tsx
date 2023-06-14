import {StrictMode, useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client"
import {
  MessageBroker,
  ChannelEvent,
} from "../../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/messagebroker"
import{
  StorageManager
} from "../../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/storagemanager"


const root = createRoot(document.getElementById("root")!)

const Frame = (): JSX.Element => {
  const brokerRef = useRef<MessageBroker | null>(null)
  const [message, setMessage] = useState("")
  const [received, setReceived] = useState("")

  const storageRef = useRef<StorageManager | null>(null)

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
    storageRef?.current?.setItem("test","msft")
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
      <h1>iFrame1</h1>
      {received}
    </div>
  )
}

root.render(
  <StrictMode>
    <Frame />
  </StrictMode>
)
