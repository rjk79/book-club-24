import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BookHeart } from 'lucide-react';

function Home(props) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full">
      <div className="flex-col sm:flex-row bg-gradient-to-r from-fuchsia-500 to-violet-500 flex justify-evenly mx-auto h-full items-center gap-x-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 capitalize text-5xl font-bold text-white">
            Book Club
            <BookHeart size={48} />
          </div>
          <div className="font-medium text-white">Share Your Favorite Books</div>
          <Button onClick={() => router.push('/books')} variant="default">
            Get Started
          </Button>
        </div>
        <div className="sm:w-1/2 shadow-lg rounded-lg overflow-hidden">
          <img src="/books.jpg" className="h-full w-full object-cover" alt="logo" />
        </div>
      </div>
    </div>
  );
}

export default Home;
