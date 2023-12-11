import type { Metadata } from 'next'

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

      <body className='bg-slate-100' >
        {children}
        </body>

    </html>
  )
}
