import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import prisma from '../lib/prisma';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    // where: { published: true },
    include: {
      author: {
        select: { name: true }, // returns specified fields
      },
    },
  });
  return {
    props: { feed },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10,
  };
};

function Home(props) {
  const router = useRouter();
  console.log(props.feed);
  
  return (
    <div className="flex flex-col gap-2 items-start">
      <div>Home</div>
      <div>
        {props?.feed.map((post, index) => (
          <div key={index}>{post.title}</div>
        ))}
      </div>
      <Menu>
        <Menu.Button className="border border-black">Pages</Menu.Button>
        <Menu.Items className="bg-red-200">
          <Menu.Item>
            {({ active }) => (
              <div
                className={classNames('capitalize cursor-pointer', {
                  'text-white': active
                })}
                onClick={() => router.push('/calculator')}>
                calculator
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div
                className={classNames('capitalize cursor-pointer', {
                  'text-white': active
                })}
                onClick={() => router.push('/restaurants')}>
                restaurants
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}

export default Home;
