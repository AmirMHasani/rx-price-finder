import { ReactNode } from "react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UserMenu } from "@/components/UserMenu";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Shared layout component with header/menu for all pages
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <img 
                  src={APP_LOGO} 
                  alt={APP_TITLE}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  RxPriceFinder
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Compare prescription prices
                </p>
              </div>
            </Link>

            {/* Right side: Menu and Language */}
            <div className="flex items-center gap-2 sm:gap-3">
              <UserMenu />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}
