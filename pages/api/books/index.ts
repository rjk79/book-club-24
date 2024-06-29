import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  try {
    const books = await prisma.book.findMany({
      orderBy: [
        {
          updatedAt: 'desc'
        }
      ]
    });

    res.json({ books });
  } catch {
    res.send('There was an error');
  }
}
