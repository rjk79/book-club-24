import prisma from '../../../lib/prisma';
import { hash } from 'bcrypt';

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password: rawPassword } = req.body;
      const password = await hash(rawPassword, 12);
      const result = await prisma.user.create({
        data: {
          email,
          password
        }
      });

      res.json({ result });
    } catch {
      res.send('There was an error');
    }
  }
}
