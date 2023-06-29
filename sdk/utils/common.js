
const deployConfig = require('../../deployConfig.json');

const getDeployConfig = () => {
    return deployConfig;
}

const getWidgetConfig = () => {
    const widgetConfig = require(deployConfig.fallbackConfigPath);
    return widgetConfig;
}
module.exports = {
    getDeployConfig,
    getWidgetConfig
}


