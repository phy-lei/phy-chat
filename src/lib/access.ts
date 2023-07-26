 export function getGithubAccessToken() {
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

  if (!githubAccessToken || githubAccessToken.length === 0) {
    throw new Error('Missing GITHUB_ACCESS_TOKEN')
  }

  return githubAccessToken;
}