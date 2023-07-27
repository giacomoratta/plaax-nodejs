import axios, { AxiosError } from 'axios'
import { HttpGateway } from '../index'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const createAxiosResponse = (extendResponse): object => {
  return {
    status: 200,
    statusText: 'OK',
    data: undefined,
    headers: {},
    ...extendResponse
  }
}

const createAxiosError = (extendResponse): AxiosError => {
  const error = new AxiosError()
  Object.assign(error, {
    message: 'axios error',
    code: undefined,
    config: undefined,
    request: undefined,
    response: {
      status: 500,
      statusText: 'Server error',
      config: {},
      data: undefined,
      headers: {},
      request: undefined,
      ...extendResponse
    }
  })
  return error
}

const axiosServerError500 = (): AxiosError => {
  return createAxiosError({
    status: 500,
    statusText: 'Server error'
  })
}

const TEST_SERVICE = {
  url: 'http://gateway.test:8009/rest/v2',
  timeout: 4000
}

class TestGateway extends HttpGateway {
  constructor () {
    super({
      baseUrl: TEST_SERVICE.url,
      queryParams: {
        lang: 'nl'
      },
      timeout: TEST_SERVICE.timeout,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }

  async getData (id: number): Promise<any> {
    return await this.request({
      method: 'GET',
      endpoint: `/test-data/${id}`,
      queryParams: {
        sort: 'desc'
      }
    })
  }
}

describe('HttpGateway', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws Gateway Error in case of unexpected error', async () => {
    mockedAxios.isAxiosError.mockImplementationOnce(() => false)
    mockedAxios.get.mockImplementationOnce(() => {
      throw new Error('unexpected!')
    })

    const gateway = new TestGateway()
    const execution = async (): Promise<object> => await gateway.getData(123456789)

    await expect(execution()).rejects.toThrow()
  })

  it('gracefully handles an axios error with some response data', async () => {
    mockedAxios.isAxiosError.mockReturnValueOnce(true)
    mockedAxios.get.mockImplementationOnce(() => {
      throw axiosServerError500()
    })

    const gateway = new TestGateway()
    const execution = async (): Promise<object> => await gateway.getData(999000777)

    await expect(execution()).resolves.toMatchObject({ status: 500, statusText: 'Server error' })
  })

  it('should call request method and axios method, and return axios response', async () => {
    const gateway = new TestGateway()
    mockedAxios.get.mockResolvedValueOnce(createAxiosResponse({
      data: {
        id: 123,
        name: 'Bob'
      }
    }))
    const gatewayRequest = jest.spyOn<any, string>(gateway, 'request')

    const data = await gateway.getData(123)

    expect(gatewayRequest).toHaveBeenCalledWith({
      endpoint: '/test-data/123',
      method: 'GET',
      queryParams: {
        sort: 'desc'
      }
    })
    expect(axios.get).toHaveBeenCalledWith('http://gateway.test:8009/rest/v2/test-data/123', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      params: {
        lang: 'nl',
        sort: 'desc'
      },
      timeout: 4000
    })
    expect(data).toMatchObject({
      data: {
        id: 123,
        name: 'Bob'
      },
      status: 200,
      statusText: 'OK'
    })
  })
})
