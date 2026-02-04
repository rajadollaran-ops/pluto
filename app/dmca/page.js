// app/dmca/page.js
export default function DMCA() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">DMCA Copyright Policy</h1>
      <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
        <div className="space-y-6 text-justify">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Digital Millennium Copyright Act (DMCA) Notice</h2>
            <p>123Movies respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement committed using our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Reporting Copyright Infringement</h2>
            <p>If you are a copyright owner, or authorized to act on behalf of one, please report alleged copyright infringements taking place on or through our website by completing the following DMCA Notice of Alleged Infringement and delivering it to our designated Copyright Agent.</p>
            
            <div className="bg-slate-700 p-4 rounded mt-3 text-justify">
              <h3 className="font-semibold text-white mb-2">DMCA Notice of Alleged Infringement (&quot;Notice&quot;)</h3>
              <p>When delivering the Notice to us, please include the following:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-1 text-justify">
                <li>Identification of the copyrighted work that you claim has been infringed</li>
                <li>Identification of the material that is claimed to be infringing with enough detail so that we may locate it</li>
                <li>Your contact information including address, telephone number, and email address</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner</li>
                <li>Your physical or electronic signature</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Designated Copyright Agent</h2>
            <p>Please submit your DMCA notices to our designated Copyright Agent:</p>
            <div className="bg-slate-700 p-4 rounded mt-3 text-justify">
              <p><strong>Copyright Agent</strong><br />
              123Movies Copyright Department<br />
              Email: copyright@123movies.com<br />
              Phone: +1 (555) 123-4567</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Counter-Notice</h2>
            <p>If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have authorization from the copyright owner, you may send a counter-notice containing the following information to our Copyright Agent:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-justify">
              <li>Your physical or electronic signature</li>
              <li>Identification of the content that has been removed and its location before removal</li>
              <li>A statement under penalty of perjury that you have a good faith belief the content was removed by mistake</li>
              <li>Your name, address, and telephone number</li>
              <li>A statement that you consent to the jurisdiction of federal court in your district</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Repeat Infringers</h2>
            <p>It is our policy to terminate the accounts of repeat infringers in appropriate circumstances.</p>
          </section>

          <p className="text-sm text-gray-400 mt-8 text-justify">Note: This policy is provided for informational purposes only and does not constitute legal advice.</p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'DMCA Policy - 123Movies',
  description: 'Digital Millennium Copyright Act policy and procedures for reporting copyright infringement.',
  keywords: 'DMCA, copyright, infringement, 123movies copyright',
};
