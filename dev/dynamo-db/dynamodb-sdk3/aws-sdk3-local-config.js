const { fromIni } = require("@aws-sdk/credential-providers");

module.exports = {
    getLocalConfig: () => {
        return {
            credentials: fromIni({ profile: 'giacomoratta1' }),
            region: "eu-west-1"
        }
    }
}