import {useCallback, useEffect, useState} from "react"
import {useAPIRequest, useRequest} from "../hooks"

const KeyvaultAccess = () => {
  const request = useAPIRequest()

  const [secret, setSecret] = useState<string | undefined>()
  const [secretName, setSecretName] = useState("customsecret")

  const getSecret = useCallback(() => {
    setSecret("loading")

    request(`/keyvault/${secretName}`)
      .then((response: any) => setSecret(response.data.value))
      .catch(e => {
        console.log(e)
        setSecret(JSON.stringify(e.response.data))
      })
  }, [request, secretName])

  return (
    <div>
      <h4>Keyvault Test</h4>
      <br />
      <input type="text" className="form-control" onChange={e => setSecretName(e.target.value)}></input>
      <button className="btn btn-default" onClick={() => getSecret()}>
        Get Secret
      </button>
      <br />
      {secret && <label>Secret: {secret} </label>}
    </div>
  )
}

export default KeyvaultAccess
