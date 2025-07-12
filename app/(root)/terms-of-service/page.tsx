'use client'

import { useRouter } from "next/navigation"


export default function TermsOfService() {
    const router = useRouter()

    return (
      <main className="max-w-4xl mx-auto p-6 prose prose-slate dark:prose-invert">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
  
        <p className="font-semibold">Last updated: May 2025</p>
            <br />
        <p>Welcome! By using our platform, you agree to follow these rules and guidelines.</p>
  
        <h2 className="text-xl font-semibold mt-2">1. Agreeing to the Rules</h2>
        <p>
          When you use our app, you accept these terms and our privacy policy. If you don{"'"}t agree,
          please don{"'"}t use the app.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">2. How You Can Use the Service</h2>
        <p>
          Use the app only for legal and respectful purposes. Don{"'"}t do anything that harms other users
          or the platform.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">3. Your Account</h2>
        <p>Keep your login info safe. You{"'"}re responsible for everything done with your account.</p>
  
        <h2 className="text-xl font-semibold mt-2">4. What You Share</h2>
        <p>
          You own the content you post, like messages or project details. We may use it to provide the
          service, but you keep ownership.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">5. What{"'"}s Not Allowed</h2>
        <p>Don{"'"}t do anything illegal or disruptive. Be respectful and follow the law.</p>
  
        <h2 className="text-xl font-semibold mt-2">6. If We Need to Stop Your Access</h2>
        <p>
          We can block or remove your access if you break these rules, without warning.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">7. Our Responsibility</h2>
        <p>
          We aren{"'"}t responsible for any problems, like lost messages or data, that happen while you use
          the app.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">8. Changes to These Terms</h2>
        <p>
          We may update these rules. If you keep using the app after changes, it means you agree with
          the new rules.
        </p>
  
        <h2 className="text-xl font-semibold mt-2">9. Contact Us</h2>
        <p>If you have questions, email us at <a href="mailto:soufianeboukir0@gmail.com"> soufianeboukir0@gmail.com</a></p>

        <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:underline dark:text-blue-400 mt-5"
        >
            ← Back to previous page
        </button>
      </main>
    )
  }
  