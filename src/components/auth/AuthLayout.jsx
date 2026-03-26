import { Shield, Lock, Zap, Eye, CheckCircle2 } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-stretch">
      {/* Left side - Centered Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[400px] animate-fade-up">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-text-secondary text-sm">{subtitle}</p>
            )}
          </div>
          <div className="bg-background-surface border border-border p-8 rounded-2xl shadow-xl">
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Informative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#121218] p-16 items-center justify-center border-l border-border/50 overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="relative max-w-md">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex-center mb-8 shadow-glow">
            <Shield size={24} className="text-primary" />
          </div>

          <h2 className="text-4xl font-bold text-text-primary mb-6 leading-tight">
            Sophisticated code security for <span className="text-primary italic">modern</span> builds.
          </h2>
          
          <div className="space-y-6">
            {[
              { title: "AI Core Analysis", desc: "Millions of threat patterns analyzed in cycles." },
              { title: "Immediate Fix Suggestions", desc: "Don't just find bugs - fix them with one click." },
              { title: "Compliance Ready", desc: "OWASP Top 10 and CWE standards by default." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-background/40 transition-all duration-300">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{feature.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
