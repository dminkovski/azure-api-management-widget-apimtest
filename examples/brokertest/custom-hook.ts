import {useState, useEffect} from "react"
import {useMessageBroker, useStorageManager} from "../../src/hooks"

export interface IUseSettings {
  settings: any | null
  update: (settings: any) => void
  reset: () => void
}

// Example Hook: Use the existing Hooks to build your own custom Hook
export function useSettings() {
  const TOPIC = "widget-settings"
  const [settings, setSettings] = useState(null)
  const {getItem, setItem, clear} = useStorageManager()
  const {publish, subscribe} = useMessageBroker({topic: TOPIC})

  const update = (settings: any) => {
    setItem(TOPIC, settings)
    publish(settings)
  }

  const reset = () => {
    clear()
    publish("")
  }
  useEffect(() => {
    subscribe(TOPIC, (event: any) => {
      const item = getItem(TOPIC)
      setSettings(item)
    })

    const item = getItem(TOPIC)
    setSettings(item)
  }, [])

  return {
    settings,
    update,
    reset,
  }
}
