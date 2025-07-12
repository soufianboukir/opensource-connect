'use client'

import { useRouter } from 'next/navigation'

export default function PrivacyPolicy() {
  const router = useRouter()

  return (
        <main className="max-w-4xl mx-auto p-6 prose prose-slate dark:prose-invert">
            <h1 className="text-3xl font-semibold">Privacy Policy</h1>
            <p className="font-semibold">Last updated: May 2025</p>
            <br />
            <p>
                We care about your privacy. This policy explains how we collect, use, and protect your
                personal information when using our platform.
            </p>

            <h2 className="text-xl font-semibold mt-2">1. What Information We Collect</h2>
            <p>
                We may collect your name, email, avatar, messages, project details, and any feedback you
                share with us.
            </p>

            <h2 className="text-xl font-semibold mt-2">2. How We Use Your Information</h2>
            <p>
                We use your data to help you connect with others, manage conversations, apply to projects,
                and improve our service.
            </p>

            <h2 className="text-xl font-semibold mt-2">3. Sharing of Information</h2>
            <p>
                We do not share your data even with trusted platforms.
            </p>

            <h2 className="text-xl font-semibold mt-2">4. Data Security</h2>
            <p>
                We use reasonable measures to protect your information, but no system is 100% secure. Keep
                your login details private.
            </p>

            <h2 className="text-xl font-semibold mt-2">5. Your Rights</h2>
            <p>
                You can access, update, or delete your personal information at any time by contacting us or
                using your account settings.
            </p>

            <h2 className="text-xl font-semibold mt-2">6. Changes to This Policy</h2>
            <p>
                We may update this privacy policy. We’ll notify you of major changes. Continued use of the
                platform means you accept the new terms.
            </p>

            <h2 className="text-xl font-semibold mt-2">7. Contact Us</h2>
            <p>
                If you have any questions about your privacy, please email us at
                <a href="mailto:soufianeboukir0@gmail.com"> soufianeboukir0@gmail.com</a>
            </p>

            <button
                onClick={() => router.back()}
                className="mb-4 text-blue-600 hover:underline dark:text-blue-400 mt-5"
            >
                ← Back to previous page
            </button>
        </main>
  )
}
