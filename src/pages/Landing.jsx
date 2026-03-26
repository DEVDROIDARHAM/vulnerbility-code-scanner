import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import {
  Shield,
  Zap,
  ArrowRight,
  Bug,
  Lock,
  BarChart3,
  UserPlus,
  HelpCircle,
  Plus,
  Minus,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What programming languages does ScanSentinel support?",
      a: "ScanSentinel supports 9 programming languages: JavaScript, TypeScript, Python, PHP, Java, Ruby, Go, C++, and C#. Our pattern-based detection engine covers language-specific vulnerabilities for each, while Bandit provides deep AST analysis for Python code."
    },
    {
      q: "How accurate is the vulnerability detection?",
      a: "ScanSentinel uses a multi-layer approach combining 40+ regex patterns mapped to OWASP categories, Bandit static analysis for Python, and optional Claude AI deep analysis. While no tool catches 100% of vulnerabilities, our layered approach significantly reduces false negatives compared to single-method scanners."
    },
    {
      q: "Is my code stored anywhere?",
      a: "Only the first 500 characters of each scan are stored in our database for scan history purposes — and only when you are logged in. Guest scans are never stored. We never share, sell, or use your code for any purpose other than displaying your personal scan history."
    },
    {
      q: "Do I need to create an account to use ScanSentinel?",
      a: "No account required to get started. Guest users get 5 free scans immediately with no signup. Creating a free account unlocks unlimited scans, persistent scan history, and access to the full ScanSentinel AI security chatbot."
    },
    {
      q: "What is the ScanSentinel AI chatbot?",
      a: "ScanSentinel AI is a specialized security assistant powered by Meta's Llama 3.3 70B model via Groq API. It answers questions exclusively about cybersecurity topics — vulnerabilities, OWASP categories, secure coding practices, and fix recommendations. It's designed to complement the scanner, not replace it."
    },
    {
      q: "How is the security score calculated?",
      a: "Your security score starts at 100 and decreases based on the severity and count of vulnerabilities found. Critical vulnerabilities (like SQL injection or hardcoded secrets) reduce the score more than low-severity issues. A score of 80+ is considered good, 50-79 needs attention, and below 50 indicates serious security issues requiring immediate action."
    },
    {
      q: "Can ScanSentinel replace a professional security audit?",
      a: "ScanSentinel is a powerful first line of defense and developer education tool, but it does not replace a professional penetration test or security audit for production systems handling sensitive data. Think of it as your daily driver for catching common issues fast — not as a replacement for comprehensive audits."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-[#10b981] bg-[#10b981]/5' : 'border-border/50 bg-background-surface'}`}
        >
          <button
            className="w-full flex items-center justify-between p-6 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className={`font-bold transition-colors ${openIndex === i ? 'text-text-primary' : 'text-text-secondary'}`}>
              {faq.q}
            </span>
            <div className={`p-1 rounded-full transition-transform duration-300 ${openIndex === i ? 'bg-[#10b981]/20 text-[#10b981] rotate-180' : 'bg-background-elevated text-text-muted'}`}>
              <ChevronDown size={20} />
            </div>
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-6 pt-0 text-text-muted leading-relaxed text-sm">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      desc: "Scan thousands of lines in seconds with our optimized AI engine. Get instant, actionable results.",
    },
    {
      icon: Bug,
      title: "Deep Vulnerability Detection",
      desc: "Detect SQL injection, XSS, SSRF, and 50+ vulnerability types using strict OWASP standards.",
    },
    {
      icon: Lock,
      title: "Contextual Fix Suggestions",
      desc: "Don't just find issues - fix them. Get specific, high-quality code-level fix suggestions immediately.",
    },
    {
      icon: BarChart3,
      title: "State-of-the-art Reporting",
      desc: "Track your security health with sophisticated charts and categorized vulnerability breakdowns.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden px-4 text-center">
        {/* Background Sophistication */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 uppercase tracking-widest leading-none">
            <Shield size={14} strokeWidth={2.5} />
            AI-POWERED CODE SECURITY
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight mb-8 leading-[1.1]">
            Build <span className="text-primary italic">Faster</span>. <br />
            Scan <span className="text-primary">Smarter</span>.
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
            Detect security vulnerabilities in your source code with precision. 
            Automated AI analysis that understands context, not just patterns.
          </p>

          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-64 h-14 text-base font-bold shadow-glow" 
                iconRight={ArrowRight}
                onClick={() => navigate('/dashboard')}
              >
                {isAuthenticated ? "Open Dashboard" : "Try as Guest"}
              </Button>
              {!isAuthenticated && (
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-64 h-14 text-base font-bold" iconRight={UserPlus}>
                    Sign Up for Full Access
                  </Button>
                </Link>
              )}
            </div>
            
            {!isAuthenticated && (
              <p className="text-text-muted text-xs font-bold uppercase tracking-[0.2em] animate-pulse-soft">
                No account needed to try • 5 free scans as guest
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Trust Line */}
      <div className="border-y border-border/50 bg-background-surface/30 py-6">
        <div className="container-custom flex flex-wrap justify-center gap-x-12 gap-y-4 text-text-muted text-xs font-mono uppercase tracking-widest opacity-60 text-center">
          <span>OWASP Top 10</span>
          <span>CWE Standard</span>
          <span>AI Refined</span>
          <span>Zero-Config</span>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-32 bg-[#111118]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Sophisticated Intelligence
            </h2>
            <p className="text-text-secondary">
              Everything you need to secure your code in one premium workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-background-surface border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-glow-lg animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/20 flex-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Code Security Matters */}
      <section className="py-32 border-y border-border/30 bg-[#0c0c12]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
              Why Code Security Matters
            </h2>
            <p className="text-text-secondary text-lg">
              The cost of insecure code is higher than you think
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-fade-up">
            {[
              { val: "$4.45M", label: "Average cost of a data breach in 2023 (IBM Report)" },
              { val: "43%", label: "Of breaches target developers directly" },
              { val: "74%", label: "Of developers admit to shipping vulnerable code" }
            ].map((s, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-background-surface border border-border/50">
                <div className="text-4xl md:text-5xl font-extrabold text-[#10b981] mb-3">{s.val}</div>
                <div className="text-sm text-text-muted font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { 
                icon: AlertCircle, 
                title: "Vulnerabilities Hide in Plain Sight", 
                content: "Most security vulnerabilities are introduced during development — not by hackers, but by developers writing code under pressure. SQL injection, XSS, and insecure authentication account for over 60% of all reported breaches. The scary part? Most of these vulnerabilities are completely preventable with the right tools and awareness." 
              },
              { 
                icon: Zap, 
                title: "The Price of Ignoring Security", 
                content: "A single unpatched vulnerability can cost millions. In 2023, the average cost of a data breach reached $4.45 million (IBM). Beyond financial damage, breaches destroy user trust, invite regulatory fines, and can shut down businesses entirely. Catching vulnerabilities during development costs 100x less than fixing them after deployment." 
              },
              { 
                icon: Shield, 
                title: "Shift Security Left", 
                content: "The security industry calls it 'shifting left' — integrating security checks early in the development process rather than treating it as an afterthought. Tools like ScanSentinel bring enterprise-grade vulnerability detection directly into your workflow, so you catch issues before they become incidents." 
              },
              { 
                icon: Bug, 
                title: "OWASP Top 10 — The Developer's Security Bible", 
                content: "The Open Web Application Security Project (OWASP) publishes the Top 10 most critical security risks for web applications. From injection attacks to broken authentication, these vulnerabilities appear in applications of every size. ScanSentinel maps every scan result directly to OWASP categories, giving you industry-standard context for every issue found." 
              }
            ].map((b, i) => (
              <div key={i} className="p-8 rounded-2xl bg-background-surface border-l-4 border-l-[#10b981] border-y border-r border-border/50 hover:bg-background-elevated transition-colors animate-fade-up">
                <div className="flex items-center gap-4 mb-4">
                  <b.icon className="text-[#10b981]" size={24} />
                  <h3 className="text-xl font-bold text-text-primary">{b.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {b.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-20 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary text-sm">
              Everything you need to know about ScanSentinel
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50 blur-[120px]" />
        <div className="container-custom relative z-10 text-center animate-fade-up">
          <h2 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-8 tracking-tight">
            Start Scanning Your Code Today
          </h2>
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-medium">
            Join developers who take security seriously. Free to use. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full sm:w-64 h-16 text-lg font-bold shadow-glow"
              onClick={() => navigate('/dashboard')}
            >
              Start Scanning Free →
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-64 h-16 text-lg font-bold"
              onClick={() => navigate('/chat')}
            >
              Talk to ScanSentinel AI →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
