# AWS Notes

## Cloudformation

#### CAPABILITY_NAMED_IAM vs CAPABILITY_IAM (for `--capabilities` parameter)

The parameter `--capabilities` is needed whenever a resource of type AWS::IAM::Role is present into 
the "resources" section of a template. `CAPABILITY_NAMED_IAM` is needed if we have IAM resources with 
custom names, otherwise `CAPABILITY_IAM` is fine.

#### Useful links

- Uploading local artifacts to an S3 bucket: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-cli-package.html


## Lambda

#### Enable sourceMap for Node + Typescript
1. Add `"sourceMap": true` on `compilerOptions` in `tsconfig.json`
2. Add lambda env. var. `NODE_OPTIONS: "--enable-source-maps"`
