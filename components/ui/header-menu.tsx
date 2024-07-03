import React from 'react';
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
import { BookHeart } from 'lucide-react';
import Link from 'next/link';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useMediaQuery } from '@mantine/hooks';
import { UserCircle } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/router';

export const HeaderMenu = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { data: session } = useSession();
  const router = useRouter();

  console.log(session);

  return (
    <div className="shadow-lg relative h-12 bg-purple-300 w-full justify-center flex">
      <div className="hidden sm:flex items-center gap-x-2 absolute top-2.5 left-4 content-center text-xl font-medium">
        Book Club
        <BookHeart size={25} />
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {isMobile ? <BookHeart size={25} /> : 'Home'}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/books" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                View Book List
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/create-book" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Add to List
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="top-2 h-8 w-8 hover:bg-purple-400 absolute right-2 font-medium flex justify-center items-center h-full text-sm hover:bg-accent rounded-sm ">
          <UserCircle className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {session?.user?.email ? (
            <>
              <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {session?.user ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>
              Sign Out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/sign-in')}>
              Sign In
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
