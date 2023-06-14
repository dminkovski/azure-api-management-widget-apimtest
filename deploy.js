const {deployNodeJS} = require("@azure/api-management-custom-widgets-tools")

const serviceInformation = {
  resourceId:
    "/subscriptions/55d8ae77-2cb9-4d2b-b3ee-1a5cb53b71e2/resourceGroups/APIMTestingRG/providers/Microsoft.ApiManagement/service/apiWidgetTest",
  managementApiEndpoint: "https://management.azure.com",
  tokenOverride: process.env.npm_config_bearerToken,
}
const name = "apimtest"
const fallbackConfigPath = "./static/config.msapim.json"

deployNodeJS(serviceInformation, name, fallbackConfigPath)
