# Custom Widget Project Boilerplate - React

This is a custom widget project boilerplate (React) designed to be deployed to the API Management Developer Portal on Azure.
It provides a starting point for developing and deploying your own custom widgets to enhance the functionality and user experience of the Developer Portal.

## Features

- **Widget Development:**
  This boilerplate includes a pre-configured project structure and build setup for developing custom widgets.
- **Integration with API Management:** It is designed to seamlessly integrate with Azure API Management, allowing you to extend the functionality of the Developer Portal.
- **Widget Configuration:** This project includes a configuration file that allows you to define the widget's settings, appearance, and behavior.
- **Easy Deployment:** You can easily deploy your custom widget to the API Management Developer Portal using the provided deployment scripts and instructions.

## Prerequisites

Before using this project, ensure that you have the following prerequisites installed:

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher)

---

## Getting Started

To get started with the custom widget project boilerplate, follow these steps:

1. Clone this repository to your local development environment.

2. Open a terminal or command prompt and navigate to the cloned repository's directory.

3. Install the project dependencies by running the following command:

   ```shell
   npm install
   ```

4. Customize the widget by modifying the source files located in the src directory. You can define the widget's appearance and behavior by editing the relevant files.

5. Configure the widget by updating the vite.config.json file in the src directory. Define the widget's settings including width and height.

6. Run the widget by running the following command:

   ```shell
   npm start
   ```

7. Build the widget by running the following command:

   ```shell
   npm run build
   ```

   This will compile the widget source code and generate a deployable bundle in the dist directory.

8. Follow the deployment instructions in the next section to deploy your custom widget to the API Management Developer Portal.

## Examples

You can find working examples in the /examples folder.
If you want to view the multi-widget example, follow these steps:

1. Run the local server
2. Open http://localhost:3000/examples/widgets.html to view

## Testing

You can test the widget inside the portal using your local server:

1. Make sure the development server started. To do that, check output on the console where you started the server in the previous step. It should display the port the server is running on (for example, http://127.0.0.1:3000).
2. Go to your API Management service in the Azure portal and open your developer portal with the administrative interface.
3. Append /?MS_APIM_CW_localhost_port=3000 to the URL. Change the port number if your server runs on a different port.

## Deployment

To deploy your custom widget to the API Management Developer Portal on Azure, follow these steps:

1. Open a terminal or command prompt and navigate to the cloned repository's directory.
2. Log in to Azure
3. Run the deploy script by running the following command:

   ```shell
   npm run deploy
   ```

4. Configure the widget by adding the custom widget to the Developer Portal's interface.
5. Save your changes and test the custom widget on the Developer Portal to ensure it functions as expected.

## Need help?

- Read our [Azure Developer Portal Documentation](https://learn.microsoft.com/de-de/azure/api-management/api-management-howto-developer-portal)

- Read our [API Management Documentation](https://learn.microsoft.com/de-de/azure/api-management/)
- Read our [Custom Widget Documentation](https://learn.microsoft.com/en-us/azure/api-management/developer-portal-extend-custom-functionality#create-and-upload-custom-widget)

### Community

Try our [community resources](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#community-resources).

### Reporting security issues and security bugs

Security issues and bugs should be reported privately, via email, to the Microsoft Security Response Center (MSRC) <secure@microsoft.com>. You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Further information, including the MSRC PGP key, can be found in the [Security TechCenter](https://www.microsoft.com/msrc/faqs-report-an-issue).

## Contributing

For details on contributing to this repository, see the [contributing guide](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md).

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit
<https://cla.microsoft.com>.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# React Project Hooks

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

## 'useStorageManager'

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

# Do's & Don'ts for Custom Widgets

When developing custom widgets for the API Management Developer Portal, it's important to follow certain best practices to ensure optimal functionality and user experience. Here are some key "Do's and Don'ts" to keep in mind:

## Do's

1. **Use proper protocols for communication:** When building custom widgets that rely on asynchronous communication within iframes, it's recommended to use the provided Hooks such as useStorageManager or useMessageBroker for secure and reliable data exchange between the widgets.

2. **Implement error handling:** Handle errors gracefully within your custom widgets. This includes validating data inputs, catching and logging errors, and providing meaningful error messages to users. Proper error handling improves the overall stability and usability of your widget.

3. **Separate logic and presentation:** Follow best practices for code organization and maintain a clear separation between the widget's business logic and its presentation layer. This makes your code more maintainable and allows for easier customization and extension of the widget's appearance and behavior.

4. **Thoroughly test your widget:** Prior to deployment, thoroughly test your custom widget in different scenarios to ensure its reliability, responsiveness, and compatibility across various browsers and devices. Validate that it functions as expected, performs well, and does not interfere with the overall user experience of the Developer Portal.

5. **Document your widget:** Provide comprehensive documentation, including installation instructions, configuration options, and usage examples, to guide other developers who may want to leverage or customize your custom widget. Clear documentation promotes adoption and facilitates collaboration.

## Don'ts

1. **Rely solely on message brokers without protocols:** Avoid relying solely on message brokers without following proper protocols. Directly depending on an asynchronous nature without defined communication protocols can lead to unpredictable behavior. Always utilize the provided Hooks such as useStorageManager or useMessageBroker and establish structured communication protocols.

2. **Assume widget placement or context:** Do not assume the placement or context of your custom widget within the Developer Portal. Design your widget to be flexible and adapt to different placements and configurations, ensuring it remains functional and visually appealing in various scenarios.

3. **Overcomplicate the widget:** Keep your custom widget simple and focused on its core purpose. Avoid adding excessive features or unnecessary complexity that may confuse users or impact the performance of the Developer Portal. Aim for a streamlined and intuitive user experience.

4. **Neglect security considerations:** Ensure that your custom widget follows best practices for security. Implement appropriate measures, such as input validation, secure communication protocols, and protection against common web vulnerabilities like cross-site scripting (XSS) and cross-site request forgery (CSRF).

5. **Forget to update and maintain:** Regularly update and maintain your custom widget to ensure compatibility with future versions of the Developer Portal and to address any identified issues or security vulnerabilities. Stay informed about updates and changes to the Developer Portal and proactively adapt your widget accordingly.

By following these do's and don'ts, you are on a great path to develop custom widgets that can integrate with the API Management Developer Portal, provide valuable functionality to users, and maintain a high level of security and performance.
