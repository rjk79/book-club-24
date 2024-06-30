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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PencilIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

const FormSchema = z.object({
  imageUrl: z.string().optional(),
  notes: z.string().max(50).optional(),
  rating: z.string().optional()
});

function EditBook(props) {
  const router = useRouter();
  const { bookId } = router.query;

  const bookResult = useQuery({
    queryKey: ['readBook'],
    queryFn: () => readBook(),
    enabled: !!bookId
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`/api/book/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notes: data.notes,
        rating: parseInt(data.rating)
      })
    });

    toast({
      title: 'Book added successfully'
    });

    router.push('/books');
  }

  async function readBook() {
    const res = await fetch(`/api/book/${bookId}`, {
      method: 'GET'
    });

    const jsonRes = await res.json();

    form.setValue('imageUrl', jsonRes.imageUrl);
    form.setValue('notes', jsonRes.notes || '');
    form.setValue('rating', jsonRes.rating.toString());

    return;
  }

  return (
    <div className="p-4 sm:p-10 flex flex-col gap-2 items-start">
      <div className="flex flex-col gap-4 sm:w-1/2 mx-auto">
        <div className="capitalize text-2xl font-medium">Edit Book</div>
        <div className="h-56 overflow-hidden ">
          <img src={form.getValues().imageUrl} className="w-full h-full object-contain" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select One" />
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
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="default">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditBook;
