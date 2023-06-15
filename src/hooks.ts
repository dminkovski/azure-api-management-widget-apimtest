import {useCallback, useContext, useEffect, useRef, useState} from "react"
import {OnChange, onChangeWithOrigin} from "@azure/api-management-custom-widgets-tools"

import {Values} from "./values"
import {SecretsContext, WidgetDataContext} from "./providers"
import axios from "axios"

import {
  MessageBroker,
  ChannelEvent,
} from "../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/messagebroker"

import {
  StorageManager,
  StorageType,
} from "../../../api-management-custom-widget-tools/sdk/apimanagement/api-management-custom-widgets-tools/src/storagemanager"

export const useValues = () => useContext(WidgetDataContext).values
export const useEditorValues = () => useContext(WidgetDataContext).data.values
export const useSecrets = () => useContext(SecretsContext)

export function useOnChange(): OnChange<Values> {
  const {
    data: {instanceId},
  } = useContext(WidgetDataContext)
  return useCallback(values => onChangeWithOrigin("*", instanceId, values), [instanceId])
}

export function useRequest(): (url: string) => Promise<Response> {
  const secrets = useSecrets()

  return useCallback(
    url =>
      fetch(
        `${secrets.managementApiUrl}${url}?api-version=${secrets.apiVersion}`,
        secrets.token ? {headers: {Authorization: secrets.token}} : undefined
      ),
    [secrets]
  )
}

export function useAPIRequest(): (url: string) => Promise<Response> {
  const secrets = useSecrets()

  let init: any = {
    method: "GET",
  }
  if (secrets.token) {
    init.headers = {Authorization: secrets.token}
  }
  return useCallback(url => axios.get(`https://apiwidgettest.azure-api.net${url}?api-version=7.4`, init), [secrets])
}

export interface UseMessageBrokerProps {
  topic: string
  callback?: (event: ChannelEvent) => void
}

export interface IUseMessageBroker {
  publish: (message: string, topicOverride?: string) => void
  subscribe: (topicOverride?: string, callbackOverride?: (event: ChannelEvent | any) => void) => boolean
  lastEvent: ChannelEvent | null
}
export function useMessageBroker({topic = "default", callback}: UseMessageBrokerProps): IUseMessageBroker {
  const brokerRef = useRef<MessageBroker | null>(null)
  const [lastEvent, setLastEvent] = useState<ChannelEvent | null>(null)

  useEffect(() => {
    if (!brokerRef.current) {
      brokerRef.current = new MessageBroker()
    }
  }, [])

  const subscribe = (topicOverride?: string, callbackOverride?: (event: ChannelEvent | any) => void) => {
    if (!brokerRef.current) {
      return false
    }
    return brokerRef?.current?.subscribe(topicOverride || topic, (event: ChannelEvent) => {
      setLastEvent(event)
      if (callback && typeof callback === "function") {
        callback(event)
      }
      if (callbackOverride && typeof callbackOverride === "function") {
        callbackOverride(event)
      }
    })
  }

  const publish = (message: string, topicOverride?: string) => {
    brokerRef?.current?.publish(topicOverride || topic, message)
  }

  return {
    publish,
    subscribe,
    lastEvent,
  }
}

export interface IUseStorageManager {
  getItem: (key: string) => string
  setItem: (key: string, value: string) => void
  clear: () => void
}
export function useStorageManager(storageType?: StorageType) {
  const storageRef = useRef<StorageManager | null>(null)

  useEffect(() => {
    if (!storageRef.current) {
      storageRef.current = new StorageManager(storageType)
    }
  }, [])

  const getItem = (key: string) => {
    return storageRef?.current?.getItem(key)
  }
  const setItem = (key: string, value: string) => {
    storageRef?.current?.setItem(key, value)
  }
  const clear = () => {
    storageRef?.current?.clear()
  }
  return {
    getItem,
    setItem,
    clear,
  }
}

/** Further Examples */

export interface IUseSettings {
  settings: any | null
  update: (settings: any) => void
  reset: () => void
}
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
