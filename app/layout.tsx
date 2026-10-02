import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeNoSekai — Developer Community',
  description:
    'A collaborative ecosystem for developers building next-generation AI bots, full-stack applications, and open-source tools.',
  keywords: [
    'CodeNoSekai',
    'developer community',
    'open source',
    'AI bots',
    'TypeScript',
    'Salman Ahmad',
    'ahmmikun',
  ],
  authors: [{ name: 'Salman Ahmad (ahmmikun)', url: 'https://github.com/ahmmikun' }],
  icons: {
    icon: 'https://github.com/CodeNoSekai.png',
    apple: 'https://github.com/CodeNoSekai.png',
  },
  openGraph: {
    title: 'CodeNoSekai — Developer Community',
    description:
      'Collaborative space for developers to learn, build, and ship open source software together.',
    url: 'https://github.com/CodeNoSekai',
    siteName: 'CodeNoSekai',
    images: [
      {
        url: 'https://github.com/CodeNoSekai.png',
        width: 400,
        height: 400,
        alt: 'CodeNoSekai Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CodeNoSekai — Developer Community',
    description:
      'Collaborative space for developers to build high-impact open source tools.',
    images: ['https://github.com/CodeNoSekai.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-accent-green selection:text-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
