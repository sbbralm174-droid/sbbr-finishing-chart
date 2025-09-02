// hooks/usePageSlider.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const usePageSlider = (pages, interval = 50000) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Make sure there are enough pages to loop through.
    if (!pages || pages.length < 2) {
      console.error('Pages array must have at least two paths for the slider to loop.');
      return;
    }

    const timer = setInterval(() => {
      // Calculate the next page index.
      // The modulo operator (%) ensures the index wraps back to 0.
      const nextIndex = (currentPageIndex + 1) % pages.length;
      setCurrentPageIndex(nextIndex);

      // Push the next page path to the router.
      router.push(pages[nextIndex]);
    }, interval);

    // Clean up the timer when the component unmounts.
    return () => clearInterval(timer);
  }, [currentPageIndex, pages, interval, router]);

  // Return the current index if you need it for any UI feedback.
  return currentPageIndex;
};

export default usePageSlider;