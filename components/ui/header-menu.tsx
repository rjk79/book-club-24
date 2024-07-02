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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export const HeaderMenu = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');

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
    </div>
  );
};
