import { ReduxProvider } from '@/redux/provider'
import './globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Digital Classroom',
  description: 'This is a learning managment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;400&display=swap" rel="stylesheet" />
        </head>
      <body className=''>
        <ReduxProvider>
        {children}
        </ReduxProvider>
        </body>
    </html>
  )
}
