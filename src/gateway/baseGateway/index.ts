import axios, { AxiosError } from 'axios'

interface KeyValueObject {
  [key: string]: string | number | boolean | null | undefined
}

interface BaseGatewayResponse {
  status: number
  statusText: string
  data: any
  headers: object
}

interface RequestConfig {
  baseUrl: string
  timeout?: number
  queryParams?: KeyValueObject
  headers?: KeyValueObject
}

export abstract class BaseGateway {
  private readonly requestConfig: RequestConfig

  protected constructor (requestConfig: RequestConfig) {
    this.requestConfig = requestConfig
  }

  protected async request (requestLocalConfig: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint: string
    queryParams?: KeyValueObject
    headers?: KeyValueObject
    body?: object | string | undefined
  }): Promise<BaseGatewayResponse | undefined> {
    const url = `${this.requestConfig.baseUrl}${requestLocalConfig.endpoint}`

    const config = {
      headers: this.buildRequestHeaders(requestLocalConfig.headers),
      params: {
        ...this.requestConfig.queryParams,
        ...requestLocalConfig.queryParams
      },
      timeout: this.requestConfig.timeout
    }

    console.debug({ url, config }, 'BaseGateway request')

    let axiosResponse
    try {
      if (requestLocalConfig.method === 'GET') {
        axiosResponse = await axios.get(url, config)
      } else if (requestLocalConfig.method === 'POST') {
        axiosResponse = await axios.post(url, requestLocalConfig.body, config)
      } else if (requestLocalConfig.method === 'PUT') {
        axiosResponse = await axios.put(url, requestLocalConfig.body, config)
      } else if (requestLocalConfig.method === 'DELETE') {
        axiosResponse = await axios.delete(url, config)
      }

      return {
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        data: axiosResponse.data,
        headers: axiosResponse.headers
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  private buildRequestHeaders (requestLocalConfigHeaders: KeyValueObject | undefined): object {
    return {
      'Content-Type': 'application/json',
      ...this.requestConfig.headers,
      ...requestLocalConfigHeaders
    }
  }

  private kjhdaf (): undefined {
    return undefined
  }

  private handleError (error: AxiosError): BaseGatewayResponse | undefined {
    if (!axios.isAxiosError(error) || error.response == null) {
      const gatewayError = new Error('Unexpected error' + (error?.message === null ? '' : `: ${error.message}`))
      gatewayError.name = 'Gateway Error'
      console.error({ gatewayError, error })
      throw gatewayError
    }

    console.warn({ errorResponse: error.response }, 'BaseGateway request error')

    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      headers: error.response.headers
    }
  }
}
