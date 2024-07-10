import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  try {
    const { orderBy, filterBy, userId } = req.query;
    const options: any = {
      orderBy: [
        {
          [orderBy]: 'desc'
        }
      ],
      where: {
        AND: [
          {
            userId: {
              equals: userId
            }
          }
        ]
      }
    };

    if (filterBy) {
      options.where.AND.push({
        rating: {
          equals: parseInt(filterBy)
        }
      });
    }
    const books = await prisma.book.findMany(options);

    res.json({ books });
  } catch {
    res.send('There was an error');
  }
}
