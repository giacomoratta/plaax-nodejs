import { apiHelloWorldById } from '../index'

describe('API Controllers', () => {
  describe('GET Hello by ID', () => {
    it('should respond with 200', async () => {
      const ctx = { params: { id: '11-22-33' }, status: undefined }
      await apiHelloWorldById(ctx)
      expect(ctx.status).toEqual(200)
    })
  })
})
