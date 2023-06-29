//TODO: replace ARM client with developer API client when released
import { ApiManagementClient } from '@azure/arm-apimanagement'
import { Secrets, askForSecrets} from "@azure/api-management-custom-widgets-tools"
import { TokenCredential } from "@azure/core-auth";

const secrets: Secrets = await askForSecrets("app")

//from https://github.com/Azure/azure-sdk-for-js/blob/9e28049b905d4b5a962e2cb3af5c7827340b2122/sdk/remoterendering/mixed-reality-remote-rendering/src/authentication/staticAccessTokenCredential.ts#L10
export class DeveloperPortalTokenCredential implements TokenCredential {

    getToken(_scopes: string | string[], _options?: GetTokenOptions): Promise<AccessToken | null> {
        return askForSecrets("app")
        return Promise.resolve(this.token);
      }

  }

const client = new ApiManagementClient(new DeveloperPortalTokenCredential(), "", { endpoint: "", pipeline: })






