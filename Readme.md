# React Hooks Documentation

This documentation explains how to use the provided hooks in your project.

## 'useMessageBroker'

The useMessageBroker hook allows you to interact with a message broker and subscribe to a topic to receive messages or publish messages to a topic.
This can be mainly used to communicate between widgets.

### Props

The hook accepts the following props:

```typescript
export interface UseMessageBrokerProps {
  topic: string
  callback?: (event: ChannelEvent) => void
}
```

- **'topic'** (required)
  : The topic you want to subscribe to or publish messages to.
- **'callback'** (optional)
  : A callback function that will be called when a new event is received from the message broker.

### Return Value

The **'useMessageBroker'** hook returns an object with the following properties and methods:

```typescript
export interface IUseMessageBroker {
  publish: (message: string, topicOverride?: string) => void
  subscribe: (topicOverride?: string, callbackOverride?: (event: ChannelEvent | any) => void) => boolean
  lastEvent: ChannelEvent | null
}
```

- **'publish'**
  : A function that allows you to publish a message to the message broker. It accepts the following parameters:

  - **'message'** (required)
    : The message to be published.
  - **'topicOverride'** (optional)
    : An optional topic to override the default topic provided during the hook initialization.

- **'subscribe'**
  : A function that allows you to subscribe to a topic in the message broker. It accepts the following parameters:
  - **'topicOverride'** (optional)
    : An optional topic to override the default topic provided during the hook initialization.
  - **'callbackOverride'** (optional): An optional callback function to override the default callback provided during the hook initialization.
    This callback will be called when a new event of type _ChannelEvent_ with **topic**, **sender** and **message** is received from the message broker.
- **'lastEvent:'**' The last event received from the message broker. It will be initially set to null and updated whenever a new event is received.

### Example Usage

```typescript
import {useMessageBroker, ChannelEvent} from "../hooks"

const MyComponent = (): JSX.Element => {
  const [message, setMessage] = useState("")
  const MY_TOPIC = "my-topic"

  const {publish, subscribe, lastEvent} = useMessageBroker({topic: MY_TOPIC})

  useEffect(() => {
    subscribe(MY_TOPIC, (event: ChannelEvent) => {
      // Do Something with event.message | event.sender | event.topic
    })
  }, [])

  const sendMessage = () => {
    publish(message)
  }

  return (
    <div>
      <h1>My Component</h1>
      <input type="text" value={message} onChange={event => setMessage(event.target.value)} />
      <button
        onClick={() => {
          sendMessage()
        }}
      >
        Send
      </button>
      {lastEvent?.message}
    </div>
  )
}
```

## useStorageManager

The useStorageManager hook allows you to interact with the browser's storage (e.g., local storage, session storage).
And can thus be used to share settings across widgets.

### Return Value

The useStorageManager hook returns an object with the following properties and methods:

```typescript
export interface IUseStorageManager {
  getItem: (key: string) => string
  setItem: (key: string, value: string) => void
}
```

- **'getItem'**
  : A function that retrieves the value associated with a given key from the storage. It accepts the following parameter:
  - **'key'** (required)
    : The key of the item to retrieve.
- **'setItem'**
  : A function that sets the value associated with a given key in the storage. It accepts the following parameters:

  - **'key'** (required)
    : The key of the item to set.
  - **'value'** (required)
    : The value to set for the given key.

### Example usage

```typescript
import {useStorageManager} from "../hooks"

const MyComponent = (): JSX.Element => {
  const {getItem, setItem} = useStorageManager()

  useEffect(() => {
    const value = getItem("language")
  }, [])

  const setSettings = () => {
    setItem("settings", "test")
  }

  return (
    <div>
      <h1>My Component</h1>
      <button
        onClick={() => {
          setSettings()
        }}
      >
        Set
      </button>
    </div>
  )
}
```
