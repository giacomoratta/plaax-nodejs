# AWS Notes

## Cloudformation

#### `CAPABILITY_NAMED_IAM` vs `CAPABILITY_IAM` (for `--capabilities` parameter)
The parameter `--capabilities` is needed whenever a resource of type AWS::IAM::Role is present into 
the "resources" section of a template. `CAPABILITY_NAMED_IAM` is needed if we have IAM resources with 
custom names, otherwise `CAPABILITY_IAM` is fine.


#### Extend Templates: "Includes" or "Nested Stacks"?
These two solutions does not solve the same problem.
`AWS::Include` is actually used to extend a template, so it is a solution to improve the 
readability of the main CloudFormation template.
`Nested stacks` is an infrastructural solution for complex stacks (it creates a tree of substacks).

**Nested stacks** are stacks created as part of other stacks.
You create a nested stack within another stack by using the `AWS::CloudFormation::Stack resource`.
See [Working with nested stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html).

**`AWS::Include` transform**, is a macro hosted by AWS CloudFormation, to insert boilerplate content into your templates.
The `AWS::Include` transform lets you create a reference to a template snippet in an Amazon S3 bucket.
See [AWS::Include transform](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/create-reusable-transform-function-snippets-and-add-to-your-template-with-aws-include-transform.html).

Both solutions need the extra `.yml` files to be stored on an S3 Bucket.
At the moment it was not possible to use local template files.


#### Useful links
- Uploading local artifacts to an S3 bucket: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-cli-package.html


## Lambda

#### Enable sourceMap for Node + Typescript
1. Add `"sourceMap": true` on `compilerOptions` in `tsconfig.json`
2. Add lambda env. var. `NODE_OPTIONS: "--enable-source-maps"`
