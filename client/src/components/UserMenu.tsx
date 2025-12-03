import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  User, 
  History, 
  LayoutDashboard, 
  LogOut,
  ChevronDown 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function UserMenu() {
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
            {/* My Dashboard - Always visible */}
            <button
              onClick={() => {
                setLocation('/my-dashboard');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </button>

            {/* History - Always visible */}
            <button
              onClick={() => {
                setLocation('/history');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Search History
            </button>

            {user ? (              <>
                <div className="border-t border-border my-1"></div>

                {/* User info */}
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  Signed in as<br />
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
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
                  Sign In / Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
