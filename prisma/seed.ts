import 'dotenv/config';
import {
  Prisma,
  PrismaClient,
  Role,
  Status,
} from '../src/generated/prisma/client.js';
import { hashSync } from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter: new PrismaPg(connection),

  log: ['error'],
  errorFormat: 'pretty',
});

async function main() {
  console.log('Seeding data...');

  // 1. Clean data
  await prisma.borrowing.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (11 users: 1 Admin, 10 Regular Users)
  const password = hashSync('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@lms.com',
      password,
      role: Role.ADMIN,
    },
  });

  const users = [admin];

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  // 3. Create Books (15 books)
  const books: any[] = [];
  for (let i = 1; i <= 15; i++) {
    const book = await prisma.book.create({
      data: {
        title: `Book Title ${i}`,
        author: `Author ${i}`,
        isbn: `ISBN-1000${i}`,
        shelfLocation: `Shelf ${Math.ceil(i / 5)}`,
        availableQuantity: 5,
      },
    });
    books.push(book);
  }

  // 4. Create Borrowings for regular users (4 borrowings each)
  const regularUsers = users.filter((u) => u.role === Role.USER);
  const borrowDuration = 14 * 24 * 60 * 60 * 1000; // 14 days

  for (const user of regularUsers) {
    // Each user gets 4 different books
    const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
    const selectedBooks = shuffledBooks.slice(0, 4);

    for (let j = 0; j < 4; j++) {
      const book = selectedBooks[j];
      const isReturned = j < 2; // 2 returned, 2 borrowed
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - (j + 1) * 2); // Staggered dates

      const dueDate = new Date(borrowDate.getTime() + borrowDuration);
      const returnDate = isReturned ? new Date() : null;

      await prisma.borrowing.create({
        data: {
          userId: user.id,
          bookId: book.id,
          status: isReturned ? Status.RETURNED : Status.BORROWED,
          borrowDate,
          dueDate,
          returnDate,
        },
      });

      // Update book availability for ongoing borrowings
      if (!isReturned) {
        await prisma.book.update({
          where: { id: book.id },
          data: { availableQuantity: { decrement: 1 } },
        });
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
