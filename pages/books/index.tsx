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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import pluralize from 'pluralize';

function Home(props) {
  const [orderBy, setOrderBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState(null);
  const router = useRouter();

  const booksResult = useQuery({
    queryKey: ['readBooks', orderBy, filterBy],
    queryFn: () => readBooks()
  });

  async function readBooks() {
    const urlParams = new URLSearchParams();
    urlParams.append('orderBy', orderBy);
    if (filterBy) {
      urlParams.append('filterBy', filterBy);
    }

    const res = await fetch(`/api/books?${urlParams}`, {
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

      toast({
        title: 'Book removed successfully'
      });

      return res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  const books = (
    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
      {booksResult.data?.books.map((book, index) => (
        <Card key={index} className="sm:w-56 relative pt-4">
          <XIcon
            onClick={() => mutation.mutate(book.id)}
            size={20}
            className="absolute right-1 top-2 cursor-pointer"
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
  );

  const zeroState = (
    <div className="flex gap-2">
      <div>No books added.</div>
      <Link href={'/create-book'} className="underline">
        Add a book!
      </Link>
    </div>
  );

  const loader = (
    <div className="mx-auto">
      <LoadingSpinner className="m-auto mt-4" />
    </div>
  );

  const orderByOptions = [
    { value: 'createdAt', label: 'Created At' },
    { value: 'rating', label: 'Rating' }
  ];

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="sm:mx-10">
        <div className="capitalize text-2xl font-medium">Your Books</div>
        <div className="flex gap-4 sticky top-0 bg-white items-center z-10 py-4">
          <Select onValueChange={setOrderBy}>
            <SelectTrigger className="sm:w-1/3">
              <SelectValue placeholder="Order By" />
            </SelectTrigger>
            <SelectContent className="">
              {orderByOptions.map((option: any, index: number) => (
                <SelectItem key={index} value={option.value} className="capitalize">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setFilterBy}>
            <SelectTrigger className="sm:w-1/3">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent className="">
              {[1, 2, 3, 4, 5].map((value: any, index: number) => (
                <SelectItem key={index} value={value.toString()} className="capitalize">
                  {value} {pluralize('star', value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>{booksResult.data ? (booksResult.data.books.length ? books : zeroState) : loader}</div>
      </div>
    </div>
  );
}

export default Home;
