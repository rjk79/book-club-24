![logo](public/screenshot1.png?raw=true)

# Bookworm.ai

## Overview
Bookworm.ai is a platform for reviewing and finding books with AI

## Live Site:
https://bookworm-ai.vercel.app/

## Technologies Used:
- OpenAI GPT-3.5 Turbo
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
- Redis - for rate limiting
- Github Actions
- Cypress

## Features:

### 1. Get AI Book Recommendations
This app uses the Turbo 3.5 model provided by OpenAI to generate book recommendations.
Requests to the model are made using tokens, randomness parameters, and prompts. Tokens determine the monetary cost of the request which depends on the input size and output size.  A certain amount of randomness is introduced to vary the AI responses. Lastly, the prompt contains information about the previously read books and the desired format of the response.
After the input is sent, a streaming response is sent back which is incrementally rendered on the frontend. To prevent bad actors, there is rate limiting which is implemented using a cache and a sliding window algorithm.

### 2. Write Reviews
- Search for a book by title to find the book cover then add your notes and rating

### 3. Edit Reviews 
- Select a book to edit your notes or rating

### 4. View Books
- View all books to sort them by the date you added them or your rating. Alternatively, filter them by your rating.

### 5. Remove Books
- Remove books you no longer want to share

![logo](public/screenshot2.png?raw=true)


## Technical Challenges
Since the Next.js pages router does not allow streaming responses, the app router is used as well. 


## Project Setup:
- installs dependencies `yarn`
- get secrets `vercel env pull .env`
- runs server `vercel dev`. remove # VERCEL="1" first

- checks types `yarn build`
- fixes code formatting `yarn lint:fix`
- runs tests `yarn cypress:open`

- uses schema to generate client (generates new types) `npx prisma generate`
- seeds database `npx prisma db seed`
- views db `npx prisma studio` 

reset, push `npx prisma migrate reset` `npx prisma db push`
if new fields are not being returned, reinstall node_modules


http://localhost:3000/api/auth/signin
need to set `NEXTAUTH_SECRET` locally


