import type { Metadata } from 'next'
import AuthenticatedForgetPasswordProvider from '../providers/AuthneticateForgetPassword'


export const metadata: Metadata = {
  title: 'Forget password',
  description: '  This is a learning mangment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body>
        <AuthenticatedForgetPasswordProvider>
        {children}
        </AuthenticatedForgetPasswordProvider>
        </body>
    </html>
  )
}
