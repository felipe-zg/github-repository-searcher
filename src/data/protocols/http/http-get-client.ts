import type { HttpResponse } from '@/data/protocols/http'

export type HttpGetClientParams<T> = {
  url: string
  params?: T
  signal?: AbortSignal
}

export interface HttpGetClient<T, R> {
  get: (params: HttpGetClientParams<T>) => Promise<HttpResponse<R>>
}