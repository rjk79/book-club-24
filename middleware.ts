export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/books', '/create-book', '/book/:path']
};
