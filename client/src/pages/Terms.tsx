import { APP_TITLE } from "@/const";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: December 3, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using {APP_TITLE} ("Service"), you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              {APP_TITLE} provides prescription medication price comparison services, insurance coverage information, 
              and pharmacogenomic testing integration. Our Service helps users find the lowest prices for their 
              medications at local pharmacies based on their insurance coverage.
            </p>
            <p className="mt-4">
              <strong>Important Disclaimer:</strong> {APP_TITLE} is an informational service only. We do not sell 
              medications, provide medical advice, or replace the relationship between you and your healthcare provider. 
              All pricing information is estimated and should be verified with the pharmacy before purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
              <li>Not attempt to gain unauthorized access to any portion of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Medical Disclaimer</h2>
            <p>
              <strong>NOT MEDICAL ADVICE:</strong> The information provided by {APP_TITLE} is for informational purposes 
              only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may 
              have regarding a medical condition or medication.
            </p>
            <p className="mt-4">
              <strong>Pharmacogenomic Testing:</strong> Pharmacogenomic test results are provided for educational purposes 
              and should be reviewed with a qualified healthcare provider before making any medication decisions. These 
              results do not constitute medical advice and should not be used as the sole basis for medication changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Pricing Information</h2>
            <p>
              All medication prices displayed on {APP_TITLE} are estimates based on publicly available data, pharmacy 
              discount programs, and insurance formularies. Actual prices may vary and should be confirmed with the 
              pharmacy before purchase. We do not guarantee the accuracy or availability of any pricing information.
            </p>
            <p className="mt-4">
              Prices are updated regularly but may not reflect real-time changes. Insurance copays are estimates based 
              on typical formulary tiers and may not match your specific plan's coverage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by 
              reference. We are committed to protecting your health information in accordance with HIPAA regulations and 
              applicable privacy laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by {APP_TITLE} and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {APP_TITLE} shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
              or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any errors or omissions in pricing information or pharmacy data</li>
              <li>Any reliance on information provided through the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {APP_TITLE} and its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising out of 
              your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or 
              liability, for any reason, including if you breach these Terms. Upon termination, your right to use the 
              Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the Service 
              after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without 
              regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              Email: legal@rxprice.me<br />
              Website: rxprice.me
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            By using {APP_TITLE}, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
