import SearchPage from '@/components/search'
import React, { Suspense } from 'react'

export default function Search() {
  return (
    <div>
      <h1>Search Page</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchPage />
      </Suspense>
    </div>
  )
}
