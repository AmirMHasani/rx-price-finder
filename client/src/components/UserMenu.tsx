import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  User, 
  History, 
  LogOut,
  ChevronDown,
  FileText,
  Dna
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function UserMenu() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    setLocation('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">
          {user ? user.full_name : 'Menu'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-border z-50">
          <div className="py-1">
            {/* My Dashboard - Main hub with stats and search history */}
            <button
              onClick={() => {
                setLocation('/my-dashboard');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {t('menu.myDashboard')}
            </button>

            {/* Insurance & Profile - Consolidated Patient Info */}
            <button
              onClick={() => {
                setLocation('/patient-info');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {t('menu.insuranceProfile')}
            </button>

            {/* My Genomic */}
            <button
              onClick={() => {
                setLocation('/my-genomic');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <Dna className="w-4 h-4" />
              My Pharmacogenomics
            </button>

            {user ? (              <>
                <div className="border-t border-border my-1"></div>

                {/* User info */}
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  {t('menu.signedInAs')}<br />
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  {t('menu.signOut')}
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-1"></div>
                
                {/* Sign in / Sign up */}
                <button
                  onClick={() => {
                    setLocation('/auth');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('menu.signInSignUp')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
