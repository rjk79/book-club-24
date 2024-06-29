import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Star } from 'lucide-react';

function Home(props) {
  const router = useRouter();

  const booksResult = useQuery({
    queryKey: ['readBooks'],
    queryFn: () => readBooks()
  });

  async function readBooks() {
    const res = await fetch('/api/books', {
      method: 'GET'
    });

    return res.json();
  }
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => deleteBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readBooks'] });
    }
  });

  async function deleteBook(id) {
    try {
      const res = await fetch('/api/book', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookId: id
        })
      });

      return res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="mx-10">
        <div className="capitalize text-2xl font-medium mb-4">Your Books</div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {booksResult.data?.books.map((book, index) => (
            <Card key={index} className="sm:w-56 relative pt-4">
              <XIcon
                onClick={() => mutation.mutate(book.id)}
                size={20}
                className="absolute right-1 top-2"
              />
              {/* <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>Author</CardDescription>
              </CardHeader> */}
              <CardContent>
                <img src={book.imageUrl} />
              </CardContent>
              <CardContent className="flex">
                Rating:
                <div className="flex">
                  {Array.from({ length: book.rating }, () => (
                    <Star fill="gold" strokeWidth={0} />
                  ))}
                </div>
              </CardContent>
              <CardContent>{book.notes ? `Notes: ${book.notes}` : null}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
