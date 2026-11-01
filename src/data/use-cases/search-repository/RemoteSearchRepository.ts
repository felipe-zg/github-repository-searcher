import type { SearchRepository, SearchRepositoryParams } from "@/domain/use-cases/SearchRepository";
import type { RepositorySearchResult } from "@/domain/models"
import type { GitHubRepositorySearchResponseDTO } from "@/infra/github/models";
import { HttpStatusCode, type HttpGetClient } from "@/data/protocols/http";
import { GitHubRepositoryMapper } from "@/infra/github/mappers";
import { UnexpectedError } from "@/domain/errors";

export class RemoteSearchRepository implements SearchRepository {
  private readonly url: string;
  private readonly httpGetClient: HttpGetClient<
    SearchRepositoryParams,
    GitHubRepositorySearchResponseDTO
  >;

  constructor(
    url: string,
    httpGetClient: HttpGetClient<
      SearchRepositoryParams,
      GitHubRepositorySearchResponseDTO
    >
  ) {
    this.url = url;
    this.httpGetClient = httpGetClient;
  }

  async search(
    params: SearchRepositoryParams,
    signal?: AbortSignal
  ): Promise<RepositorySearchResult> {
    const httpResponse = await this.httpGetClient.get({
      url: this.url,
      params: {
        q: params.q,
        page: params.page,
        per_page: params.per_page
      },
      signal
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return {
          repositories: httpResponse.body?.items.map(
            GitHubRepositoryMapper.toDomain
          ) || [],
          totalCount: httpResponse.body?.total_count || 1,
          incompleteResults: httpResponse.body?.incomplete_results || false
        };
      case HttpStatusCode.notFound:
        return {
          repositories: [],
          totalCount: 0,
          incompleteResults: false
        };
      case HttpStatusCode.serverError:
        throw new UnexpectedError();
      default:
        throw new UnexpectedError();
    }
  }
}