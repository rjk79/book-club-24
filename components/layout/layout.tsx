import { HeaderMenu } from '../ui/header-menu';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from '@/components/ui/toaster';

export default function Layout({ children }: { children: any }) {
  useEffect(() => {
    document.title = 'Bookworm.ai';
  }, []);
  return (
    <>
      <HeaderMenu />
      <main>{children}</main>
      <Toaster />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};
