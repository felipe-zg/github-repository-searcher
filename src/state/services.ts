import { RemoteSearchRepository } from '@/data/use-cases'
import type { SearchRepository } from '@/domain/use-cases/SearchRepository'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/config/env'

const httpGetClient = new AxiosHttpClient()

const searchRepository = new RemoteSearchRepository(
  env.githubApiUrl,
  httpGetClient
)

export type AppServices = {
  searchRepository: SearchRepository
}

export const services: AppServices = {
  searchRepository
}