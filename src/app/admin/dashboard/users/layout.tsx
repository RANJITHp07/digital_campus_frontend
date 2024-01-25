import ApolloClassroomProvider from '@/app/providers/ApolloProvider'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Users',
  description: 'Admin dashboard of learning mangment system',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body>
        <ApolloClassroomProvider>
        {children}
        </ApolloClassroomProvider>
        </body>
      
    </html>
  )
}
