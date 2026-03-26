import { X, Check, ShieldCheck, Zap, History, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';

const UpgradeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card 
        className="relative w-full max-w-lg bg-background-surface border-border shadow-2xl animate-fade-up overflow-hidden"
        padding="p-0"
      >
        {/* Header Image/Pattern */}
        <div className="h-32 bg-primary/5 relative overflow-hidden border-b border-border">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-glow">
                <ShieldCheck size={32} className="text-primary" />
              </div>
           </div>
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all cursor-pointer"
           >
             <X size={20} />
           </button>
        </div>

        <div className="p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3 font-display">
            Trial Limit Reached
          </h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            You&apos;ve used your free guest scans. Sign up now to unlock the full potential of ScanSentinel AI.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
            {[
              { icon: Zap, text: "Unlimited Scans", color: "text-primary" },
              { icon: History, text: "Stored History", color: "text-success" },
              { icon: FileText, text: "PDF Reports", color: "text-info" },
              { icon: ShieldCheck, text: "Full OWASP Top 10", color: "text-primary-light" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background-elevated border border-border/50">
                 <feature.icon size={16} className={feature.color} />
                 <span className="text-xs font-semibold text-text-primary">{feature.text}</span>
                 <Check size={12} className="ml-auto text-success opacity-50" />
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="flex-1">
              <Button className="w-full h-12 font-bold" variant="primary">
                Create Free Account
              </Button>
            </Link>
            <Button 
              onClick={onClose} 
              variant="secondary" 
              className="flex-1 h-12 font-bold"
            >
              Continue as Guest
            </Button>
          </div>
          
          <p className="mt-6 text-[10px] text-text-muted uppercase tracking-widest font-bold">
            No credit card required • Join 10k+ developers
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UpgradeModal;
