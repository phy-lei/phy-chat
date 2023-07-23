import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// export async function POST(request: Request) {

//   const form = await request.formData();

//   const file = form.get('file') as File;
//   console.log('[ file ] >', file)
//   const blob = await put(file.name, file, { access: 'public' });

//   return NextResponse.json(blob);
// }

export async function POST(request: Request) {

  // const form = await request.formData();

  // const file = form.get('file') as File;
  // console.log('[ file ] >', file)
  // const blob = await put(file.name, file, { access: 'public' });

  // return NextResponse.json(blob);
}