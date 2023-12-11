import type { Metadata } from 'next'
import ApolloProvider from '../providers/ApolloProvider'


export const metadata: Metadata = {
  title: 'Sign up',
  description: '  This is a learning mangment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}