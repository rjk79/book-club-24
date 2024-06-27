import { HeaderMenu } from '../ui/header-menu';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Layout({ children }: { children: any }) {
  useEffect(() => {
    document.title = 'Candidate Collective';
  }, []);
  return (
    <>
      <HeaderMenu />
      <main>{children}</main>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};
