import '../src/index.css';

export const metadata = {
  title: 'Cognibloom — The AI That Teaches, Not Just Answers | Survey & Waitlist',
  description: 'Interactive Cognitive Diagnostic & Early Access Survey for Cognibloom.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Silkscreen:wght@400;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=VT323&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#95d9c0] selection:text-black">
        {children}
      </body>
    </html>
  );
}
