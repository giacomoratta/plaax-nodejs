import { getById } from '../index'

describe('API Controller: hello world', () => {
  describe('GET hello by ID', () => {
    it('should respond with 200', async () => {
      const ctx = { params: { id: '11-22-33' }, status: undefined }
      await getById(ctx)
      expect(ctx.status).toEqual(200)
    })
  })
})
