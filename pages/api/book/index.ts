import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      const { imageUrl, notes, rating, title } = req.body;
      const result = await prisma.book.create({
        data: {
          title,
          imageUrl,
          notes,
          rating
        }
      });

      res.json({ result });
    } catch {
      res.send('There was an error');
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await prisma.book.delete({
        where: {
          id: req.body.bookId
        }
      });

      res.json({ result });
    } catch (e) {
      res.send(e);
    }
  }
}
