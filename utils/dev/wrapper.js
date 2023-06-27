/**
 * This provides a wrapper for previewing and debugging a widget locally
 * used by the vite plugin
 */
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
