import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, History, LayoutDashboard, User, Menu, X, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 h-16 flex items-center">
      <div className="container-custom flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all shadow-glow overflow-hidden">
            <img src="/cyberlogo.jpg" alt="ScanSentinel logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display">
            <span className="text-white">Scan</span>
            <span className="text-primary">Sentinel</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => scrollToSection('features')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'text-text-primary hover:text-primary' : 'text-text-secondary hover:text-primary'}`}
          >
            Features
          </button>
          
          <Link to="/dashboard">
            <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} size="sm">
              <LayoutDashboard size={14} className="mr-2" />
              Scanner
            </Button>
          </Link>

          <Link to="/crypto">
            <Button variant={isActive("/crypto") ? "secondary" : "ghost"} size="sm">
              Crypto Tools
            </Button>
          </Link>

          <Link to="/chat">
            <Button variant={isActive("/chat") ? "secondary" : "ghost"} size="sm">
              AI Assistant
            </Button>
          </Link>
          
          <Link to="/about">
            <Button variant={isActive("/about") ? "secondary" : "ghost"} size="sm">
              About
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/history">
                <Button variant={isActive("/history") ? "secondary" : "ghost"} size="sm">
                  <History size={14} className="mr-2" />
                  History
                </Button>
              </Link>

              <div className="w-px h-6 bg-border mx-2" />

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-elevated border border-border">
                <User size={14} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">{user?.name}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-severity-critical hover:bg-severity-critical/10" aria-label="Log Out">
                <LogOut size={14} />
              </Button>
            </>
          ) : (
            <>
              <div className="w-px h-6 bg-border mx-2" />
              <Link to="/login" className="mr-2">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" iconRight={UserPlus}>Sign Up Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 space-y-3 animate-fade-in z-50 shadow-2xl">
          <button 
            className="block w-full text-left p-3 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => scrollToSection('features')}
          >
            Features
          </button>
          <Link to="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
            <div className={`p-3 rounded-lg ${isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-text-secondary"}`}>
              Scanner
            </div>
          </Link>
          <Link to="/crypto" className="block" onClick={() => setMobileMenuOpen(false)}>
            <div className={`p-3 rounded-lg ${isActive("/crypto") ? "bg-primary/10 text-primary" : "text-text-secondary"}`}>
              Crypto Tools
            </div>
          </Link>
          <Link to="/chat" className="block" onClick={() => setMobileMenuOpen(false)}>
            <div className={`p-3 rounded-lg ${isActive("/chat") ? "bg-primary/10 text-primary" : "text-text-secondary"}`}>
              AI Assistant
            </div>
          </Link>
          <Link to="/about" className="block" onClick={() => scrollToSection('about')}>
            <div className={`p-3 rounded-lg ${isActive("/about") ? "bg-primary/10 text-primary" : "text-text-secondary"}`}>
              About
            </div>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/history" className="block" onClick={() => setMobileMenuOpen(false)}>
                <div className={`p-3 rounded-lg ${isActive("/history") ? "bg-primary/10 text-primary" : "text-text-secondary"}`}>
                  History
                </div>
              </Link>
              <div className="border-t border-border mt-2 pt-2" />
              <Button variant="danger" className="w-full h-11" onClick={handleLogout} icon={LogOut}>Log Out</Button>
            </>
          ) : (
            <>
              <div className="border-t border-border mt-2 pt-2" />
              <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-11">Log In</Button>
              </Link>
              <Link to="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full h-11" iconRight={UserPlus}>Sign Up Free</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
