import axios from 'axios';

export const  uploadPasteImages = (accessToken: string, event: any) => {
  return new Promise<any>((resolve, reject) => {
      // 剪贴板没数据，则返回null
    if (!event.clipboardData || !event.clipboardData.items) {
      resolve(null);
    }
    const item = event.clipboardData.items[0];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (item.type.match('^image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e: any) {
          const base64 = e.target.result.split('base64,')[1];
          const filePath =
          Date.now() + file.name;
          await axios.put(
            'https://api.github.com/repos/phy-lei/blob-imgs/contents/' +
              filePath,
            {
              message: 'upload img',
              content: base64,
            },
            {
              headers: {
                Authorization: 'token ' + accessToken,
              },
            }
          ).then((res) => {
            console.log('[ res ] >', res);
            resolve(res.data.content.download_url);
            ;
          })
          .catch((err) => {
            reject(err);
          });
        };
      } else {
        resolve(null);
      }
    }   
  })
};