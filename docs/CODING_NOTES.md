# Coding Notes

## Mock libraries with Jest and Typescript
Solve the error `TS2339: Property 'mockImplementation' does not exist on type...`
```typescript
import * as MyLibrary from '../../../libs/MyLibrary'
jest.mock('../../../libs/MyLibrary')
const mockedMyLibrary = MyLibrary as jest.Mocked<typeof MyLibrary>
```