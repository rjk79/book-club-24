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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu';

function Home(props) {
  const router = useRouter();
  console.log(props.feed);

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

  async function readBookInfo() {
    const res = await fetch('https://openlibrary.org/search.json?q=the+lord+of+the+rings', {
      method: 'GET'
    });

    const jsonRes = await res.json();
    console.log(jsonRes);
    return jsonRes;
  }

  useEffect(() => {
    readBookInfo();
  }, []);

  return (
    <div className="p-10 flex flex-col gap-2 items-start">
      <div className="text-2xl font-bold text-gray-700">Book Club</div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>View Books</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>Add Book</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div></div>
      <div className="capitalize text-lg font-medium">Add a book</div>
      <div className="flex flex-col gap-4">
        <Input className="capitalize" placeholder="title" />
        <Input className="capitalize" placeholder="notes" />
        <Button variant="default">Submit</Button>
      </div>
    </div>
  );
}

export default Home;
