const { deployNodeJS } = require('@azure/api-management-custom-widgets-tools');
const deployConfig = require('./deploy.config.json');

const serviceInformation = deployConfig?.serviceInformation;
const name = deployConfig?.name
const fallbackConfigPath = deployConfig?.fallbackConfigPath

const yargs = require('yargs')
    .example(`node ./deploy ^ \r
     --resourceId "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroup>/providers/Microsoft.ApiManagement/service/<serviceName>" ^ \r
     --managementApiEndpoint "https://management.azure.com" ^ \r
     --apiVersion ""2019-01-01"" ^ \r
     --tokenOverride "<Azure AD bearer token>" ^ \r
     --name "my-custom-widget"\n`)
    .option('resourceId', {
        type: 'string',
        default: serviceInformation.resourceId,
        description: 'The Azure resource Uri',
        example: "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroup>/providers/Microsoft.ApiManagement/service/<serviceName>",
        demandOption: !serviceInformation.resourceId?.length ?? true
    })
    .option('managementApiEndpoint', {
        type: 'string',
        default: serviceInformation.managementApiEndpoint,
        description: 'The base url for Azure Resource Manager.',
        demandOption: !serviceInformation.managementApiEndpoint?.length ?? true
    })
    .option('apiVersion', {
        type: 'string',
        default: serviceInformation.apiVersion,
        description: 'Override the default ARM version string.',
        example: "2019-01-01",
        demandOption: false
    })
    .option('tokenOverride', {
        type: 'string',
        default: serviceInformation.tokenOverride,
        description: 'Override the bearer token.  Useful if using client credentials instead of interactive.',
        demandOption: false
    })
    .option('name', {
        type: 'string',
        default: name,
        description: 'The widget unique name.  Must not include invalid Url characters',
        demandOption: !name?.length ?? true,
        example: "my-custom-widget"
    })
    .help()
    .argv;

serviceInformation.resourceId = yargs.resourceId;
serviceInformation.managementApiEndpoint = yargs.managementApiEndpoint;
serviceInformation.apiVersion = yargs.apiVersion;
serviceInformation.tokenOverride = yargs.tokenOverride;

deployNodeJS(serviceInformation, yargs.name, fallbackConfigPath);

