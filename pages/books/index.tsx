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
    // const res = await fetch('/api/books', {
    //   method: 'GET'
    // });

    // return res.json();
    return [
      {
        title: 'Bridgerton',
        imageUrl:
          'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590674497i/53565978.jpg'
      },
      {
        title: 'Great Gatsby',
        imageUrl:
          'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg'
      },
      {
        title: 'Hunger Games',
        imageUrl:
          'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg'
      }
    ];
  }

  async function readBookInfo() {
    const res = await fetch('https://openlibrary.org/search.json?q=the+lord+of+the+rings', {
      method: 'GET'
    });

    const jsonRes = await res.json();
    console.log(jsonRes);
    return jsonRes;
  }

  useEffect(() => {
    // readBookInfo();
  }, []);

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="mx-10">
        <div className="capitalize text-2xl font-medium mb-4">Your Books</div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {booksResult.data?.map((book, index) => (
            <Card key={index} className="sm:w-56 relative pt-4">
              <XIcon size={20} className="absolute right-1 top-2" />
              {/* <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>Author</CardDescription>
              </CardHeader> */}
              <CardContent>
                <img src={book.imageUrl} />
              </CardContent>
              <CardContent>Rating:  
                <div className='flex'>
                { Array.from({ length: 5 }, () => (
                  <Star fill="gold" strokeWidth={0} />
              ))}
                </div>
                
              </CardContent>
              <CardContent>Notes:</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
