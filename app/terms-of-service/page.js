// app/terms-of-service/page.js

export default function TermsOfService() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
          <div className="space-y-6 text-justify">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using 123Movies, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p>123Movies provides an online platform for users to discover, watch, and share information about movies and TV shows. Our service aggregates content information from various sources including the TMDB API.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for any activities or actions under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
              <p>The 123Movies service and its original content, features, and functionality are owned by 123Movies and are protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-justify">
                <li>Use our service for any illegal purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Interfere with or disrupt our service</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Third-Party Links</h2>
              <p>Our service may contain links to third-party websites or services that are not owned or controlled by 123Movies. We have no control over and assume no responsibility for the content or practices of any third-party sites.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
              <p>In no event shall 123Movies, nor its directors, employees, or agents, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at: terms@123movies.com</p>
            </section>

            <p className="text-sm text-gray-400 mt-8 text-justify">Effective Date: January 1, 2024</p>
          </div>
        </div>
      </div>
  );
}

export const metadata = {
  title: 'Terms of Service - 123Movies',
  description: 'Read the terms and conditions for using 123Movies services and platform.',
  keywords: 'terms of service, user agreement, 123movies terms',
};
