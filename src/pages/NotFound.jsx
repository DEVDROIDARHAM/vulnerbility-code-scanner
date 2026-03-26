import { Link } from "react-router-dom";
import { Shield, Home, AlertCircle } from "lucide-react";
import Button from "../components/common/Button";
import Navbar from "../components/layout/Navbar";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12 animate-fade-up">
          <div className="text-[12rem] font-black text-primary/5 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-7xl font-display font-black text-text-primary tracking-tighter drop-shadow-2xl">
               404
             </div>
          </div>
        </div>

        <div className="max-w-sm flex flex-col items-center animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-severity-critical/10 border border-severity-critical/20 flex-center mb-6 text-severity-critical">
            <AlertCircle size={28} />
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-3">Resource Restricted</h1>
          <p className="text-sm text-text-secondary mb-10 leading-relaxed">
            The endpoint you are trying to access is either private or does not exist in our secure directory.
          </p>

          <Link to="/" className="w-full">
            <Button variant="primary" size="lg" className="w-full px-8 h-12" iconLeft={Home}>
              Return to Safe Zone
            </Button>
          </Link>
          
          <Link to="/about" className="mt-4 text-xs font-bold text-primary hover:underline uppercase tracking-widest">
            About ScanSentinel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
