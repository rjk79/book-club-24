import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const book1 = await prisma.book.create({
    data: {
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328867503i/1160788.jpg',
      rating: 4
    }
  });
  const book2 = await prisma.book.create({
    data: {
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1629291053i/58800757.jpg',
      rating: 3
    }
  });
  const book3 = await prisma.book.create({
    data: {
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1660404888i/60182574.jpg',
      rating: 3
    }
  });
  const book4 = await prisma.book.create({
    data: {
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1696821726i/199325582.jpg',
      rating: 3
    }
  });
  const book5 = await prisma.book.create({
    data: {
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631251689i/4214.jpg',
      rating: 3
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
