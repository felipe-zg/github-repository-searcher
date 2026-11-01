const githubApiUrl = import.meta.env.VITE_GITHUB_API_URL

if (!githubApiUrl) {
  throw new Error('VITE_GITHUB_API_URL is not defined')
}

export const env = {
  githubApiUrl
}