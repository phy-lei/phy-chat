import axios from 'axios';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function post(request: Request) {
  try {
    const { base64 }: { base64: string } = await request.json();
    const session = await getServerSession(authOptions);
    console.log(
      '%c [ session123 ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      session
    );
    if (!session) return new Response('Unauthorized', { status: 401 });
    const filePath =
      new Date().toLocaleDateString().replace(/\//g, '') +
      '/' +
      Date.now() +
      'image.png';
    await axios
      .put(
        'https://api.github.com/repos/phy-lei/blob-imgs/contents/' + filePath,
        {
          message: 'upload img',
          content: base64,
        },
        {
          headers: {
            Authorization: 'token ' + session.accessToken,
          },
        }
      )
      .then((res) => {
        console.log('[ res ] >', res);
        return new Response(res.data.content.download_url);
      })
      .catch((err) => {
        return new Response(err.message, { status: 500 });
      });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
