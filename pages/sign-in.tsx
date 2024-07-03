import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';
import { useSession, signIn, signOut, getProviders } from 'next-auth/react';
import Link from 'next/link';

const FormSchema = z.object({
  email: z.string(),
  password: z.string()
});

function SignIn(props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    signIn('credentials', {
      redirect: true,
      callbackUrl: '/books',
      username: data.email,
      password: data.password
    });
  }

  return (
    <div className="p-4 sm:p-10 flex flex-col gap-2 items-start">
      <div className="flex flex-col gap-4 sm:w-1/2 mx-auto">
        <div className="capitalize text-2xl font-medium">Sign In</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} className="" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} className="" type="password" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {router?.query?.error === 'CredentialsSignin' ? (
              <div className="text-red-500">Invalid credentials</div>
            ) : null}
            <Button variant="default">Submit</Button>
          </form>
        </Form>
        <Link href="/sign-up" className="hover:underline">
          Don{"'"}t have an account?
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
