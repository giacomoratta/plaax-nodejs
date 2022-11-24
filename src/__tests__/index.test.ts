import { hello } from '../index'

describe('tests for index', () => {
  it('hello world', () => {
    expect(hello()).toEqual('world')
  })
})
