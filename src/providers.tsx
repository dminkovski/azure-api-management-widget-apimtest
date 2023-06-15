import React, {useEffect, useState} from "react"
import {
  getValues,
  getWidgetData,
  Secrets,
  TargetModule,
  askForSecrets,
} from "@azure/api-management-custom-widgets-tools"
import {Values, valuesDefault} from "./values"

export const WidgetDataContext = React.createContext({data: getWidgetData<Values>(), values: getValues(valuesDefault)})
export const WidgetDataProvider: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <WidgetDataContext.Provider value={{data: getWidgetData<Values>(), values: getValues(valuesDefault)}}>
    {children}
  </WidgetDataContext.Provider>
)

export const SecretsContext = React.createContext<Secrets>({
  token: "",
  userId: "",
  apiVersion: "",
  managementApiUrl: "",
})
export const SecretsProvider: React.FC<{children?: React.ReactNode; targetModule: TargetModule}> = ({
  children,
  targetModule,
}) => {
  const [secrets, setSecrets] = useState<Secrets | undefined>()

  useEffect(() => {
    askForSecrets(targetModule)
      .then((value: any) => setSecrets(value))
      .catch(console.error)
  }, [targetModule])

  return secrets ? (
    <SecretsContext.Provider value={secrets}>{children}</SecretsContext.Provider>
  ) : (
    <div className="loading"></div>
  )
}
