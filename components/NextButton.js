// components/NextButton.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const pagePaths = [
  '/alter-chart',
  '/spot-chart',
  '/pareto-chart-for-rejection',
  '/dhu',
  // Add all your pages here in the desired order
];

const NextButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const nextButtonRef = useRef(null);

  useEffect(() => {
    // Check if the current path is in our list of slideable pages.
    const isSlideablePage = pagePaths.includes(pathname);
    
    // If the current page is not in the list, we do nothing.
    if (!isSlideablePage) {
      return;
    }

    // If it is a slideable page, start the timer.
    const timer = setInterval(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }, 25000);

    // Clean up the timer when the component unmounts.
    return () => clearInterval(timer);
  }, [pathname]); // `pathname` is a dependency to re-run the effect on page change.

  const goToNextPage = () => {
    const currentIndex = pagePaths.indexOf(pathname);
    const nextIndex = (currentIndex + 1) % pagePaths.length;
    router.push(pagePaths[nextIndex]);
  };

  return (
    <button
      ref={nextButtonRef}
      onClick={goToNextPage}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      Next Page
    </button>
  );
};

export default NextButton;