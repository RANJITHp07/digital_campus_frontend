import type { Metadata } from 'next'
import  ApolloProvider from '../providers/ApolloProvider'
import AuthenticatedProvider from '../providers/AuthenticatedProvider'
import "react-big-calendar/lib/css/react-big-calendar.css";

export const metadata: Metadata = {
  title: 'Classroom',
  description: 'This is a learning mangment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body>
        <ApolloProvider>
          <AuthenticatedProvider>
        {children}
        </AuthenticatedProvider>
        </ApolloProvider>
        </body>
    </html>
  )
}

