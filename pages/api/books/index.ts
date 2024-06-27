import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  // const {} = req.body;
  try {
    const books = await prisma.book.findMany({});

    res.json({ books });
  } catch {
    res.send('There was an error');
  }
}
