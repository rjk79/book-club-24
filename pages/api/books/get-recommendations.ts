// import { NextRequest, NextResponse } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';
// import { kv } from '@vercel/kv';

// const ratelimit = new Ratelimit({
//   redis: kv,
//   // 5 requests from the same IP in 10 seconds
//   limiter: Ratelimit.slidingWindow(5, '10 s'),
// });

// const ip = request.ip ?? '127.0.0.1';
//   const { success, pending, limit, reset, remaining } = await ratelimit.limit(
//     ip
//   );

import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  try {
    console.log(req)
    const { orderBy, filterBy } = req.query;
    const options: any = {
      orderBy: [
        {
          [orderBy]: 'desc'
        }
      ]
    };

    if (filterBy) {
      options.where = {
        rating: {
          equals: parseInt(filterBy)
        }
      };
    }
    const books = await prisma.book.findMany(options);

    res.json({ books });
  } catch {
    res.send('There was an error');
  }
}
