import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany({});
  await prisma.book.deleteMany({});
  const password = await hash('test', 12);
  const user1 = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password
    }
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'test2@test.com',
      password
    }
  });
  const book1 = await prisma.book.create({
    data: {
      title: 'Shrek',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328867503i/1160788.jpg',
      rating: 4,
      user: { connect: { id: user2.id } }
    }
  });
  const book2 = await prisma.book.create({
    data: {
      title: 'Disney',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1629291053i/58800757.jpg',
      rating: 3,
      user: { connect: { id: user1.id } }
    }
  });
  const book3 = await prisma.book.create({
    data: {
      title: 'Lady Gaga',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1660404888i/60182574.jpg',
      rating: 3,
      user: { connect: { id: user1.id } }
    }
  });
  const book4 = await prisma.book.create({
    data: {
      title: 'Taylor Swift',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1696821726i/199325582.jpg',
      rating: 3,
      user: { connect: { id: user1.id } }
    }
  });
  const book5 = await prisma.book.create({
    data: {
      title: 'Life of Pi',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631251689i/4214.jpg',
      rating: 3,
      user: { connect: { id: user1.id } }
    }
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
