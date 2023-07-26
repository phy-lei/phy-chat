import { getGithubCredentials } from '@/lib/auth';

export const config = {
  runtime: 'edge',
  // bodyParser: false,
};


export async function POST(request: Request) {
  try {
    const { base64 } = await request.json()

    const { accessToken } = getGithubCredentials();
    if (!accessToken) return new Response('Unauthorized', { status: 401 });
    const filePath =
      new Date().toLocaleDateString().replace(/\//g, '') +
      '/' +
      Date.now() +
      'image.png';

    const res = await fetch('https://api.github.com/repos/phy-lei/blob-imgs/contents/' + filePath, {
      method: 'put',
      headers: {
        Authorization: 'token ' + accessToken,
      },
      body: JSON.stringify({
        message: 'upload img',
        content: base64,
      })
    })
    const data = await res.json()

    return new Response(data.content.download_url, { status: 200 });

  } catch (error) {

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
