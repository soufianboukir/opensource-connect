import SearchPage from '@/components/search'
import React, { Suspense } from 'react'

export default function Search() {
  return (
    <div>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchPage />
      </Suspense>
    </div>
  )
}
