![logo](public/screenshot.png?raw=true)
# Book Club

## Overview
Book Club is a platform for sharing books that you've read and enjoyed.

## Live Site:
https://book-club-24.vercel.app/

## Technologies Used:
- Typescript - type checking
- Vercel - deployment
- Next.js - API routes, page routing
- Prisma ORM
- Postgres - SQL database
- Prettier
- Eslint
- React Query - for API calls
- React Form
- Tailwind - styling

## Features:
### Write Reviews
- Search for a book by title to find the book cover then add your notes and rating

### Edit Reviews 
- Select a book to edit your notes or rating

### View Books
- View all books to sort them by the date you added them or your rating. Alternatively, filter them by your rating.

### Remove Books
- Remove books you no longer want to share


## Project Setup:
- installs dependencies `yarn`
- runs server `yarn dev`

- checks types `yarn build`
- fixes code formatting `yarn lint:fix`
- runs tests `yarn cypress:open`

- uses schema to generate client (generates new types) `npx prisma generate`
- seeds database `npx prisma db seed`
- views db `npx prisma studio` 

http://localhost:3000/api/auth/signin