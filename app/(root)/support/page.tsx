'use client'

import { useRouter } from "next/navigation"


export default function ContactPage() {
  const router = useRouter()
  return (
        <section className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold">Support</h1>
            <br />
            <p className="text-lg leading-relaxed">
                If you encounter any issues, have questions, or need assistance regarding any of my projects, feel free to reach out. I{"'"}m always open to supporting users, collaborators, or anyone interested in my work.
                <br /> <br />
                Whether you need technical guidance, found a bug, have feature suggestions, or simply want to connect professionally, don{"'"}t hesitate to contact me.
                <br /> <br />
                The best way to reach me is via email at{' '}
                <a
                href="mailto:soufianeboukir0@gmail.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
                >
                    soufianeboukir0@gmail.com
                </a>
                , and I do my best to respond promptly and helpfully.
            </p>
            <button
                onClick={() => router.back()}
                className="mb-4 text-blue-600 hover:underline dark:text-blue-400 mt-5"
            >
                ← Back to previous page
            </button>
          </section>
  )
}
