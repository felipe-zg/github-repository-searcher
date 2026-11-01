import type { 
  HttpGetClient,
  HttpGetClientParams,
  HttpResponse,
  HttpStatusCode 
} from '@/data/protocols/http'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpGetClient<any, any> {
  async get(params: HttpGetClientParams<any>): Promise<HttpResponse<any>> {
    let httpResponse: AxiosResponse<any>

    try {
      httpResponse = await axios.get(params.url, {
        params: params.params,
        signal: params.signal
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        httpResponse = error.response
      } else {
        throw error
      }
    }

    return {
      statusCode: httpResponse.status as HttpStatusCode,
      body: httpResponse.data
    }
  }
}