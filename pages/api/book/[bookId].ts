import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  if (req.method === 'GET') {
    const { bookId } = req.query;

    try {
      const result = await prisma.book.findFirst({
        where: {
          id: bookId
        }
      });

      res.json(result);
    } catch (e) {
      res.send(e);
    }
  } else if (req.method === 'PUT') {
    const { bookId } = req.query;

    try {
      const { notes, rating } = req.body;
      const result = await prisma.book.update({
        where: {
          id: bookId
        },
        data: {
          rating,
          notes
        }
      });

      res.json({ result });
    } catch (e) {
      res.send(e);
    }
  }
}
