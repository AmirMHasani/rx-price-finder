import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container max-w-7xl py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{APP_TITLE}</h3>
            <p className="text-sm text-muted-foreground">
              Compare prescription prices with your insurance and find the lowest cost at local pharmacies.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  HIPAA Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/patient-info" className="text-muted-foreground hover:text-foreground transition-colors">
                  Patient Information
                </Link>
              </li>
              <li>
                <Link href="/my-genomic" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pharmacogenomics
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@rxprice.me</li>
              <li>Privacy: privacy@rxprice.me</li>
              <li>Legal: legal@rxprice.me</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {APP_TITLE}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-2xl">
              <strong>Medical Disclaimer:</strong> {APP_TITLE} is an informational service only. We do not provide medical advice. 
              Always consult your healthcare provider before making medication decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
