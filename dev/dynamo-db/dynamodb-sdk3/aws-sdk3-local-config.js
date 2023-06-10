// const { fromIni } = require("@aws-sdk/credential-providers");

const personalAwsProfile = 'giacomoratta1'

// const getCredentialsFromIni = () => {
//     return {
//         credentials: fromIni({ profile: personalAwsProfile }),
//         region: "eu-west-1"
//     }
// }

const getCredentialsFromEnvVars = () => {
    // Troubleshooting:
    // - run the script for aws env variables in the same console of this script
    if (process.env.AWS_PROFILE !== personalAwsProfile) {
        throw new Error('Unexpected AWS profile in the environment variables. ' +
          'AWS_PROFILE = ' + process.env.AWS_PROFILE)
    }
    return {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            // sessionToken: ''
            // expiration: '',
        },
        region: process.env.AWS_DEFAULT_REGION
    }
}

module.exports = {
    getLocalConfig: () => {
        return getCredentialsFromEnvVars()
    }
}