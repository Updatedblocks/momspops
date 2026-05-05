"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="bg-surface border-b border-subtle/50 shadow-sm shadow-black/5 sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute left-4 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-all duration-300 flex items-center justify-center btn-press"
          >
            <span className="material-symbols-outlined text-rose">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 pb-32 overflow-y-auto">
        <div className="prose prose-stone dark:prose-invert prose-sm max-w-none space-y-8">
          <p className="text-secondary text-sm leading-relaxed">
            <span className="font-bold text-primary">Last Updated:</span> May 2026
          </p>

          <p className="text-secondary text-sm leading-relaxed">
            Moms &amp; Pops (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
            committed to protecting your privacy. This policy explains what data we collect, how
            we use it, and your rights.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">1. What We Collect</h2>
            <div className="space-y-2">
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Account Data:</span> Your name, email
                address, and profile picture when you sign in with Google. We do not collect
                passwords.
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">User Content:</span> Text, images, audio
                recordings, and other files you upload to create or interact with personas. This
                includes interview answers, voice stories, and archived documents.
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Chat Data:</span> Messages you exchange
                with AI personas. These are stored to maintain conversation continuity.
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Usage Data:</span> Anonymous analytics
                (page views, feature usage) via Vercel Analytics. No personal identifiers are
                included.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">2. How We Use Your Data</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We use your data exclusively to provide and improve the Service — generating persona
              responses, maintaining conversation history, and calibrating persona personalities
              through our distillation engine. We do not sell, rent, or share your personal data
              with third parties for marketing purposes.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="font-bold text-primary">AI Processing:</span> User Content and chat
              messages are processed by AI models (Gemini via Google Cloud Vertex AI, and DeepSeek)
              to generate persona responses. Data sent to these providers is processed in memory
              and is not used by them to train their models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">3. Data Storage &amp; Security</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Your data is stored on Supabase (database, authentication, and file storage) with
              encryption at rest and in transit. Row-Level Security (RLS) ensures you can only
              access your own data. We implement appropriate technical and organizational measures
              to protect your information.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="font-bold text-primary">Data Location:</span> Data is stored in
              Supabase&apos;s US-East region. AI processing occurs in Google Cloud&apos;s US-Central
              region.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">4. Data Retention &amp; Deletion</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We retain your data as long as your account is active. You can delete individual
              personas (including all associated chat logs, memories, and uploaded files) at any
              time through the persona settings page. To delete your entire account and all data,
              use the Settings &gt; Delete Account option.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Deletion is permanent and irreversible. Staging files uploaded during the distillation
              process are automatically deleted after processing (&ldquo;Burn After Reading&rdquo;).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">5. Cookies</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We use essential cookies for authentication (Supabase session management) and
              preferences (theme, text size). We do not use tracking cookies or third-party
              advertising cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">6. Third-Party Services</h2>
            <div className="space-y-2">
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Supabase:</span> Auth, database, and
                storage. <span className="underline underline-offset-4">supabase.com/privacy</span>
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Google Cloud (Vertex AI):</span> AI model
                hosting. <span className="underline underline-offset-4">cloud.google.com/privacy</span>
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">DeepSeek:</span> AI chat model.
                <span className="underline underline-offset-4">deepseek.com/privacy</span>
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                <span className="font-bold text-primary">Vercel:</span> Hosting and analytics.
                <span className="underline underline-offset-4">vercel.com/legal/privacy-policy</span>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">7. Children&apos;s Privacy</h2>
            <p className="text-secondary text-sm leading-relaxed">
              The Service is not intended for children under 13. We do not knowingly collect data
              from children. If you believe a child has provided us with personal data, contact us
              immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">8. Your Rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You have the right to access, correct, export, or delete your data at any time. For
              data export, use the Settings &gt; Export Data option. For any privacy-related
              requests, contact us at{" "}
              <span className="text-rose">privacy@momspops.app</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">9. Changes to This Policy</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We will notify you of material changes via email or in-app notification. Continued
              use after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-primary">10. Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              For privacy questions or data requests, email{" "}
              <span className="text-rose">privacy@momspops.app</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
