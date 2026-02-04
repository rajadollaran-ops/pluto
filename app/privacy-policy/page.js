// app/privacy-policy/page.js

export default function PrivacyPolicy() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
          <div className="space-y-6 text-justify">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>Welcome to 123Movies. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-justify">
                <li>Email address</li>
                <li>Username and password</li>
                <li>Preferences and settings</li>
                <li>Communications you send to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-justify">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Cookies and Similar Technologies</h2>
              <p className="text-justify">We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
              <p className="text-justify">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
              <p className="text-justify">You have the right to access, correct, or delete your personal information. You can also object to the processing of your personal information or request that we restrict the processing of your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Policy</h2>
              <p className="text-justify">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
              <p className="text-justify">If you have any questions about this Privacy Policy, please contact us at: privacy@123movies.com</p>
            </section>

            <p className="text-sm text-gray-400 mt-8 text-justify">Last Updated: January 1, 2024</p>
          </div>
        </div>
      </div>
  );
}

export const metadata = {
  title: 'Privacy Policy - 123Movies',
  description: 'Learn about our privacy practices and how we protect your data at 123Movies.',
  keywords: 'privacy policy, data protection, 123movies privacy',
};
