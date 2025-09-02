// app/page.js

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-black">Welcome to the Home Page</h1>
      <div className="flex space-x-4 text-black">
        <Link href="/alter-input" passHref>
        alter-input
          
        </Link>
        <Link href="/paretoChartInput" passHref> Go to paretoChartinput </Link>
        <Link href="/input" passHref> Go to dhu input </Link>
        <Link href="/dhu/add" passHref> Go to dhu input </Link>
        <Link href="/spot-input" passHref> Go to spot input </Link>
      </div>
    </div>
  );
}