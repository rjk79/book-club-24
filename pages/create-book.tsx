import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useDebounce } from '../hooks/use-debounce';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PencilIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  notes: z.string().optional(),
  rating: z.string().optional()
});

function CreateBook(props) {
  const [title, setTitle] = useState('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rating: '1'
    }
  });
  const router = useRouter();
  const debouncedValue = useDebounce(title, 500);

  const bookCoverResult = useQuery({
    queryKey: ['readBookCover', debouncedValue],
    queryFn: () => readBookCover(),
    enabled: !!debouncedValue
  });

  async function readBookCover() {
    const formatted = debouncedValue.split(' ').join('+');
    const res = await fetch(
      `https://bookcover.longitood.com/bookcover?book_title=${formatted}&author_name=%27`,
      {
        method: 'GET'
      }
    );

    const jsonRes = await res.json();
    return jsonRes;
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`api/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: bookCoverResult.data.url,
        notes: data.notes,
        rating: parseInt(data.rating)
      })
    });

    toast({
      title: 'Book added successfully'
    });

    router.push('/books');
  }

  return (
    <div className="p-4 sm:p-10 flex flex-col gap-2 items-start">
      <div className="flex flex-col gap-4 sm:w-1/2 mx-auto">
        <div className="capitalize text-2xl font-medium">Add a book</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <Input
              className=""
              placeholder="Search by title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {bookCoverResult.isFetching || bookCoverResult.isRefetching ? (
              <div className="text-gray-500 flex flex-col items-center justify-center">
                <div>Loading book cover...</div>
                <LoadingSpinner className="m-auto mt-4" />
              </div>
            ) : bookCoverResult.data ? (
              <div className="h-40 overflow-hidden border">
                <img src={bookCoverResult.data.url} className="object-contain h-full w-full" />
              </div>
            ) : null}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <div className="relative">
                    <PencilIcon className="text-gray-400 h-4 w-4 left-2 translate top-1/2 -translate-y-1/2 absolute z-1 " />
                    <FormControl>
                      <Input {...field} className="pl-8" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select One" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {[1, 2, 3, 4, 5].map((value: any, index: number) => (
                            <SelectItem key={index} value={value.toString()} className="capitalize">
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="default"
              disabled={bookCoverResult.isFetching || bookCoverResult.isRefetching}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreateBook;
