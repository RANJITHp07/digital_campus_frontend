import type { Metadata } from 'next'



export const metadata: Metadata = {
  title: 'Submit assignment',
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
