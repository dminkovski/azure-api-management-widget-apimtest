document.addEventListener("DOMContentLoaded", () => {
  function handleEvent(event) {
    console.log("Received message in wrapper:", event.data)
    event.source.postMessage(
      {
        askForSecretsMSAPIM: {
          test: true,
          managementApiUrl: "localhost",
        },
      },
      "*"
    )
  }

  window.removeEventListener("message", handleEvent)
  window.addEventListener("message", handleEvent)
})
