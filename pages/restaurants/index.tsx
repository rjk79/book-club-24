import React from 'react';
import { useRouter } from 'next/router';

function Restaurants() {
  const router = useRouter();

  return (
    <div className="space-y-5 p-5">
      <div>List of Restaurants (WIP)</div>

      <button className="rounded-lg text-purple-400" onClick={() => router.push('/')}>
        Home
      </button>
    </div>
  );
}

export default Restaurants;
