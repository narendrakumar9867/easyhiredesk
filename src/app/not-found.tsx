import React from 'react'
import Link from "next/link";

export default function notFound() {
  return (
    <>
     <div> Page not found</div>
      <button>
        <Link href="/">return Home</Link>
      </button>
    </>
  )
}

