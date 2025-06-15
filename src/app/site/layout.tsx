import React from 'react'
import Navigation from '@/components/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { currentUser } from '@clerk/nextjs/server'
type SiteLayoutProps = {
  children: React.ReactNode
}

async function SiteLayout({ children }: SiteLayoutProps) {
  const User=await currentUser();
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <div className="min-h-screen items-center justify-center">
        <Navigation user={User} />
        {children}
      </div>
    </ClerkProvider>
  )
}

export default SiteLayout
