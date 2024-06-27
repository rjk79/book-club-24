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

const FormSchema = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number()
});

function Home(props) {
  const [title, setTitle] = useState('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rating: 1
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

  async function onSubmit() {
    console.log('submitting');
  }

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="capitalize text-2xl font-medium mx-auto">Add a book</div>
      <div className="flex flex-col gap-4 sm:w-1/2 mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="sm:w-2/3 space-y-4"></form>
        </Form>
        <Input
          className=""
          placeholder="Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {bookCoverResult.isFetching || bookCoverResult.isRefetching ? (
          <LoadingSpinner className="m-auto mt-4" />
        ) : bookCoverResult.data ? (
          <div className="h-40 overflow-hidden border">
            <img src={bookCoverResult.data.url} className="object-contain h-full w-full" />
          </div>
        ) : null}

        <Input className="" placeholder="Notes" />
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">1 - I was offended</SelectItem>
            <SelectItem value="light">2 - I did not enjoy it</SelectItem>
            <SelectItem value="dark">3 - It was okay</SelectItem>
            <SelectItem value="system">4 - I enjoyed it</SelectItem>
            <SelectItem value="system">5 - It changed my life</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default">Submit</Button>
      </div>
    </div>
  );
}

export default Home;
