import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleHelp, InfoIcon, SparklesIcon, XIcon } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCompletion } from 'ai/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MINIMUM_BOOKS = 3;

function Home(props) {
  const { data: session } = useSession();
  const [orderBy, setOrderBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('');
  const [aiApiError, setAiApiError] = useState('');
  const router = useRouter();
  const { completion, input, handleInputChange, handleSubmit, complete, isLoading } = useCompletion(
    {
      api: '/api/getRec',
      onError: (e) =>
        setAiApiError(
          'Error while fetching AI data. You might be rate-limited. Please try again later.'
        )
    }
  );

  const booksResult = useQuery({
    queryKey: ['readBooks', orderBy, filterBy],
    queryFn: () => readBooks()
  });

  async function readBooks() {
    const urlParams = new URLSearchParams();
    urlParams.append('userId', (session?.user as any).id);
    urlParams.append('orderBy', orderBy);
    if (filterBy) {
      urlParams.append('filterBy', filterBy);
    }

    const res = await fetch(`/api/books?${urlParams}`, {
      method: 'GET'
    });

    return res.json();
  }

  async function getRecommendations() {
    if (booksResult.data?.books?.length < MINIMUM_BOOKS) {
      setAiApiError(`Please add at least ${MINIMUM_BOOKS} books first.`);
    } else if (booksResult.data?.books?.length >= MINIMUM_BOOKS) {
      const book1 = booksResult.data.books[0];
      const book2 = booksResult.data.books[1];
      const book3 = booksResult.data.books[2];
      const fullSearchCriteria = `Give me a list of 3 book recommendations considering I gave these book reviews: '${book1.title}' ${book1.rating}/5, '${book2.title}' ${book2.rating}/5, '${book3.title}, ${book3.rating}/5.`;
      const formatCriteria = `Please return this response as a numbered list with the book's title, followed by a colon, and then a brief description of the book. There should be a line of whitespace between each item in the list.`;
      const searched = fullSearchCriteria + formatCriteria;

      complete(searched);
    }
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
        <Card key={index} className="sm:w-56 relative pt-4 flex flex-col justify-between">
          {/* <CardHeader>
      <CardTitle>{book.title}</CardTitle>
      <CardDescription>Author</CardDescription>
    </CardHeader> */}
          <CardContent className="pb-2">
            <img src={book.imageUrl} />
          </CardContent>

          <CardContent className="pb-2 italic">{book.notes ? `"${book.notes}"` : null}</CardContent>
          <div>
            <CardContent className="pb-2 flex">
              Rating:
              <div className="flex">
                {Array.from({ length: book.rating }, () => (
                  <Star fill="gold" strokeWidth={0} />
                ))}
              </div>
            </CardContent>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/book/${book.id}`)}>
                Edit
              </Button>
              {session?.user?.email === 'test@test.com' ? null : (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Book</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this book?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => mutation.mutate(book.id)}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );

  const zeroState = (
    <div className="flex gap-2">
      <div>No books added.</div>
      <Link href={'/create-book'} className="underline">
        Add a book {'>>>'}
      </Link>
    </div>
  );

  const loader = (
    <div className="mx-auto">
      <LoadingSpinner className="m-auto mt-4" />
    </div>
  );

  const orderByOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'rating', label: 'Rating' }
  ];

  const completionText = (
    <div className="p-4 border-2 rounded-lg border-fuchsia-500">
      <div className="text-2xl font-medium bg-gradient-to-r from-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
        AI Recommendations:
      </div>
      <div className="whitespace-pre-line">{completion}</div>
    </div>
  );

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="flex gap-2 sm:flex-row flex-col-reverse justify-between w-full">
        {booksResult.data?.books ? (
          <div className="relative flex items-center">
            <Button
              variant="outline"
              className={classNames(
                'bg-green-400 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:bg-green-500 text-white hover:text-white',
                {}
              )}
              onClick={getRecommendations}
              disabled={!!completion}>
              Get AI Recommendations
              <SparklesIcon className="h-4 w-4 ml-2" />
            </Button>
            <Popover>
              <PopoverTrigger>
                <CircleHelp className="ml-2 h-5 w-5 text-violet-500" />
              </PopoverTrigger>
              <PopoverContent>
                Ask AI for book suggestions based on your 3 most recent book ratings. Please note
                that requests for AI suggestions are rate-limited.
              </PopoverContent>
            </Popover>
          </div>
        ) : null}
      </div>
      {completion ? (
        completionText
      ) : isLoading ? (
        <LoadingSpinner />
      ) : aiApiError ? (
        <div className="text-red-500">{aiApiError}</div>
      ) : null}
      <div className="capitalize text-2xl font-bold">All Books</div>

      <div className="items-start flex flex-col gap-4 sticky top-0 bg-white z-10 py-4 w-full">
        <div className="flex gap-4 w-full items-center ">
          <Select onValueChange={setOrderBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="">
              {[1, 2, 3, 4, 5].map((value: any, index: number) => (
                <SelectItem key={index} value={value.toString()} className="capitalize">
                  <div className="flex">
                    {Array.from({ length: value }, () => (
                      <Star fill="gold" strokeWidth={0} />
                    ))}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm">
          Total Results: {booksResult.data ? booksResult.data.books.length : null}
        </div>
      </div>
      <div>{booksResult.data ? (booksResult.data.books.length ? books : zeroState) : loader}</div>
    </div>
  );
}

export default Home;
