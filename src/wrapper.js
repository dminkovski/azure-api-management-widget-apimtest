document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("message", function (event) {
    console.log("Received message in wrapper:", event.data)
    event.source.postMessage({
      askForSecretsMSAPIM: {
        test: true,
        managementApiUrl: "localhost",
      },
    })
  })
})
