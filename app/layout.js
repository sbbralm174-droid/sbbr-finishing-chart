// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import NextButton from '@/components/NextButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Auto Slider App',
  description: 'An app with an auto-sliding page router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <NextButton /> {/* Add the NextButton component here */}
      </body>
    </html>
  );
}