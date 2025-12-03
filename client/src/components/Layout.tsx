import { ReactNode } from "react";
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
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <img 
                  src={APP_LOGO} 
                  alt={APP_TITLE}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-xl font-bold text-foreground">{APP_TITLE}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Compare prescription prices with your insurance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
