import { APP_TITLE } from "@/const";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: December 3, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              {APP_TITLE} ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of 
              your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our Service.
            </p>
            <p className="mt-4">
              <strong>HIPAA Compliance:</strong> We are committed to complying with the Health Insurance Portability and 
              Accountability Act (HIPAA) and protecting your Protected Health Information (PHI) in accordance with 
              federal regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Date of birth and gender</li>
              <li>ZIP code and location data</li>
              <li>Insurance information (carrier, plan, member ID, group number)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Health Information (Protected Health Information - PHI)</h3>
            <p>We may collect sensitive health information, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Current medications and dosages</li>
              <li>Medical conditions and diagnoses</li>
              <li>Medication allergies</li>
              <li>Family medical history</li>
              <li>Pharmacogenomic test results and genetic information</li>
              <li>Medication search history</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Price Comparison:</strong> To search for medication prices at local pharmacies based on your insurance coverage</li>
              <li><strong>Personalization:</strong> To provide personalized medication recommendations and pricing estimates</li>
              <li><strong>Pharmacogenomic Testing:</strong> To process and display genetic test results and medication interactions</li>
              <li><strong>Account Management:</strong> To create and maintain your user account</li>
              <li><strong>Communication:</strong> To send you service updates, price alerts, and important notifications</li>
              <li><strong>Analytics:</strong> To improve our Service and understand user behavior</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
            <p>
              We do NOT sell your personal health information to third parties. We may share your information only in 
              the following limited circumstances:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 With Your Consent</h3>
            <p>We will share your information when you explicitly authorize us to do so.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Service Providers</h3>
            <p>
              We may share information with trusted third-party service providers who assist us in operating our Service, 
              such as:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Cloud hosting providers (data storage)</li>
              <li>Pharmacogenomic testing laboratories</li>
              <li>Payment processors</li>
              <li>Analytics providers</li>
            </ul>
            <p className="mt-4">
              All service providers are required to maintain the confidentiality and security of your information and 
              are prohibited from using it for any purpose other than providing services to us.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Court orders or subpoenas</li>
              <li>Government investigations</li>
              <li>Legal proceedings</li>
              <li>Protection of our rights or safety</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the 
              acquiring entity, subject to the same privacy protections.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data privacy and security</li>
              <li>Compliance with HIPAA Security Rule requirements</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
            <p>You have the following rights regarding your personal information:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Access and Portability</h3>
            <p>You have the right to access and receive a copy of your personal health information.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Correction</h3>
            <p>You have the right to request correction of inaccurate or incomplete information.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Deletion</h3>
            <p>
              You have the right to request deletion of your personal information, subject to legal and regulatory 
              retention requirements.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.4 Restriction of Processing</h3>
            <p>You have the right to request that we limit how we use your information.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.5 Opt-Out</h3>
            <p>You have the right to opt out of marketing communications at any time.</p>

            <p className="mt-6">
              To exercise any of these rights, please contact us at privacy@rxprice.me. We will respond to your request 
              within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience and collect usage data. You 
              can control cookies through your browser settings. However, disabling cookies may limit your ability to 
              use certain features of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our Service and comply with legal 
              obligations. Pharmacogenomic test results are retained for 7 years in accordance with medical record 
              retention requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy 
              Policy and applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Service 
              after such changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Privacy Officer</strong><br />
              Email: privacy@rxprice.me<br />
              Website: rxprice.me
            </p>
            <p className="mt-4">
              <strong>HIPAA Privacy Officer</strong><br />
              For HIPAA-related inquiries or to file a complaint:<br />
              Email: hipaa@rxprice.me
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. State-Specific Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">California Residents (CCPA)</h3>
            <p>
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including 
              the right to know what personal information is collected, the right to delete personal information, and 
              the right to opt-out of the sale of personal information. We do not sell personal information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Other States</h3>
            <p>
              Residents of other states may have additional privacy rights under state law. Please contact us to learn 
              more about your specific rights.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Your privacy is important to us. We are committed to protecting your personal health information and 
            maintaining your trust.
          </p>
        </div>
      </div>
    </div>
  );
}
