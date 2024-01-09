import type { Metadata } from 'next'
import ApolloProvider from '../providers/ApolloProvider'
import AuthenticatedProvider from '../providers/AuthenticatedProvider'


export const metadata: Metadata = {
  title: 'Payment success full',
  description: '  This is a learning mangment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ApolloProvider>
      <AuthenticatedProvider>
      <body>{children}</body>
      </AuthenticatedProvider>
      </ApolloProvider>
    </html>
  )
}
