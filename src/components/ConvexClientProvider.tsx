'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

// Create a fallback client if no URL is provided
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder.convex.cloud'
const convex = new ConvexReactClient(convexUrl)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no Convex URL is provided, just render children without Convex
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.warn('NEXT_PUBLIC_CONVEX_URL not found. Running without Convex integration.')
    return <>{children}</>
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}