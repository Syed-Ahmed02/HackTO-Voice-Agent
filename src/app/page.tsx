import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function HomePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // If user is authenticated, redirect to progress page
  redirect('/progress')
}
