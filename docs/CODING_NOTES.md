# Coding Notes

### Jest: use environment variables
1. Add the following value in `jest.config.js`:
   ```
   setupFiles: ['<rootDir>/.jest/setEnvVars.js']
    ```
2. Create the file `setEnvVars.js` in the main level of the repository;
3. Set all values for environment variables:
   ```
   process.env.ENV_NAME='test'
   process.env.ANOTHER_VAR='test-value'
   ```

### Jest: mock libraries with Typescript
Solve the error `TS2339: Property 'mockImplementation' does not exist on type...`
```typescript
import * as MyLibrary from '../../../libs/MyLibrary'
jest.mock('../../../libs/MyLibrary')
const mockedMyLibrary = MyLibrary as jest.Mocked<typeof MyLibrary>
```

### Jest: mock EXTERNAL libraries (with Typescript)
This way, the external library can be imported into test files.
Then the external library can be used immediately or some of its functions can be mocked.
1. Jest is configured by default to read `__mocks__` folder in the main level of the repository;
2. Create a directory with the same name of the external library;
3. Create files or subdirectories that match the path used with the `import`/`require`.

N.b. at the moment it **does not solve** the error `TS2339: Property 'mockImplementation' does not exist on type...`
Possible solution in [testUtils.ts](..%2Fsrc%2F__tests__%2FtestUtils.ts).

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
const ddbClient = new DynamoDBClient({})
ddbClient.send.mockImplementation(async () => {})
```
**Directory structure**
```
<root-dir>
├─ __mocks__
│  ├─ @aws-sdk 
│  │  ├─ client-dynamodb.ts
```
