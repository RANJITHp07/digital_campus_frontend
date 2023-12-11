import type { Metadata } from 'next'
import ApolloassignmentProvider from '@/app/providers/ApolloassignmentProvider'
import ApolloClassroomProvider from '../../providers/ApolloProvider'


export const metadata: Metadata = {
  title: 'Create assignment',
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
        {children}
        </body>

    </html>
  )
}
