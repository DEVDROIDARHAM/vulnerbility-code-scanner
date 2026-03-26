import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Shield, Github, BookOpen, User } from "lucide-react";

const owaspCategories = [
  {
    id: "A01",
    title: "Broken Access Control",
    description: "Failures allowing users to act outside permissions or access unauthorized data."
  },
  {
    id: "A02",
    title: "Cryptographic Failures",
    description: "Weaknesses exposing sensitive data through weak algorithms or key management."
  },
  {
    id: "A03",
    title: "Injection",
    description: "SQL, XSS, and command injection where untrusted data is sent to interpreters."
  },
  {
    id: "A04",
    title: "Insecure Design",
    description: "Fundamental architecture flaws requiring threat modeling to address."
  },
  {
    id: "A05",
    title: "Security Misconfiguration",
    description: "Missing hardening, default configs, or unnecessary features enabled."
  },
  {
    id: "A06",
    title: "Vulnerable Components",
    description: "Using libraries with known vulnerabilities or outdated dependencies."
  },
  {
    id: "A07",
    title: "Auth Failures",
    description: "Weaknesses in session management, passwords, or credential storage."
  },
  {
    id: "A08",
    title: "Data Integrity Failures",
    description: "Lack of integrity verification in CI/CD pipelines or code delivery."
  },
  {
    id: "A09",
    title: "Logging Failures",
    description: "Insufficient visibility preventing detection of active breaches."
  },
  {
    id: "A10",
    title: "SSRF",
    description: "Server-Side Request Forgery from unvalidated user-supplied URLs."
  }
];

const About = () => {
  const [activeTab, setActiveTab] = useState("aboutus");
  
  const skills = [
    "React",
    "JavaScript",
    "Python Flask",
    "Cybersecurity",
    "Networking",
    "Cisco Certified",
    "OWASP",
    "AI Integration",
  ];

  const documentationSteps = [
    {
      number: 1,
      icon: "📋",
      title: "Paste Your Code",
      description: "Copy and paste any code snippet into the scanner editor on the Dashboard. Supports JavaScript, TypeScript, Python, PHP, Java, Ruby, Go, C++, and C#."
    },
    {
      number: 2,
      icon: "🌐",
      title: "Select Your Language",
      description: "Choose the programming language from the dropdown. This helps ScanSentinel apply the right detection patterns and static analysis rules for your code."
    },
    {
      number: 3,
      icon: "▶️",
      title: "Run the Scan",
      description: "Click the Scan button and let ScanSentinel analyze your code. Results appear in seconds with a full vulnerability report."
    },
    {
      number: 4,
      icon: "📊",
      title: "Review Results",
      description: "Check your Security Score, review each vulnerability card, read the OWASP category mapping, and follow the fix recommendations to secure your code."
    },
    {
      number: 5,
      icon: "🤖",
      title: "Ask ScanSentinel AI",
      description: "Have questions about a vulnerability? Head to the AI Assistant and ask ScanSentinel AI powered by Llama 3.3. It answers security questions instantly."
    },
    {
      number: 6,
      icon: "🔐",
      title: "Use Crypto Tools",
      description: "Need to encode, decode, or analyze encrypted data? Visit the Crypto Tools page for 10 built-in ciphers including Caesar, Base64, XOR, Morse, and more."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1">
        
        {/* Header Section */}
        <section className="px-4 py-16 md:py-20 border-b border-border/50">
          <div className="container-custom max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Shield size={12} />
              About ScanSentinel
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-text-secondary leading-relaxed max-w-4xl">
              Discover how ScanSentinel makes security accessible to every developer, whether you're learning cybersecurity or building secure applications professionally.
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/50 px-4">
          <div className="container-custom max-w-5xl">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("documentation")}
                className={`py-4 px-1 text-sm font-semibold uppercase tracking-widest border-b-2 transition-colors ${
                  activeTab === "documentation"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Documentation
                </div>
              </button>
              <button
                onClick={() => setActiveTab("aboutus")}
                className={`py-4 px-1 text-sm font-semibold uppercase tracking-widest border-b-2 transition-colors ${
                  activeTab === "aboutus"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
                  About Us
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Documentation Tab */}
        {activeTab === "documentation" && (
          <section className="px-4 py-16 md:py-20">
            <div className="container-custom max-w-4xl">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">How to Use ScanSentinel</h2>
                <p className="text-text-secondary text-lg">Get started in seconds</p>
              </div>

              <div className="space-y-8 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-6 md:left-8 top-12 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent" />

                {documentationSteps.map((step) => (
                  <div key={step.number} className="relative pl-20 md:pl-24">
                    {/* Green number badge */}
                    <div className="absolute left-0 md:left-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-black font-bold text-lg md:text-xl shadow-lg shadow-primary/50">
                      {step.number}
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl md:text-3xl">{step.icon}</span>
                        <h3 className="text-xl md:text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-text-secondary leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Us Tab */}
        {activeTab === "aboutus" && (
          <section className="px-4 py-16 md:py-20">
            <div className="container-custom max-w-5xl">
              {/* Builder Card */}
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Built by a Developer, for Developers</h2>
                <p className="text-text-secondary text-lg mb-12">ScanSentinel was created to make security accessible to every developer.</p>

                <div className="rounded-2xl border border-border bg-background-surface p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar and Name */}
                    <div className="flex flex-col items-center md:items-start flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center text-black font-black text-4xl md:text-5xl shadow-lg shadow-primary/50 mb-4">
                        AA
                      </div>
                      <h3 className="text-2xl font-bold">Arham Amir</h3>
                      <p className="text-primary font-semibold text-sm md:text-base">Frontend Developer → MERN Stack (in progress)</p>
                      <p className="text-text-secondary text-sm">Karachi, Pakistan</p>
                    </div>

                    {/* Bio Section */}
                    <div className="flex-1">
                      <p className="text-text-secondary leading-relaxed mb-4">
                        Hi, I'm Arham — a frontend developer from Karachi, Pakistan, currently expanding into full-stack MERN development. I built ScanSentinel as a portfolio project to combine my passion for development with my knowledge of cybersecurity, networking, and secure coding practices.
                      </p>
                      <p className="text-text-secondary leading-relaxed">
                        I'm Cisco certified with hands-on knowledge of networking and cybersecurity fundamentals, and currently pursuing a diploma in AI from Aptech Learning. ScanSentinel represents everything I've learned — React, Python Flask, AI integration, database design, and security-first development.
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-8 pt-8 border-t border-border/50">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Skills & Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 text-xs rounded-full bg-background-elevated border border-border text-text-secondary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <a
                      href="https://github.com/DEVDROIDARHAM"
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Github size={16} />
                      View GitHub
                    </a>
                    <button
                      type="button"
                      disabled
                      className="h-11 px-5 inline-flex items-center justify-center rounded-xl bg-white/5 text-text-muted border border-white/10 cursor-not-allowed opacity-60"
                    >
                      Portfolio - Coming Soon
                    </button>
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="rounded-2xl border border-border bg-background-elevated/40 p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Why ScanSentinel Exists</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Most security tools are built for security professionals — not for developers writing code every day. ScanSentinel bridges that gap by bringing vulnerability detection, AI-powered security assistance, and cryptography tools into one clean, developer-friendly interface.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Security shouldn't be an afterthought. It should be part of every line of code you write.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* OWASP Categories Section */}
        <section className="px-4 py-16 md:py-20 bg-background-surface/30 border-t border-border/50">
          <div className="container-custom max-w-5xl">
            <h2 className="text-3xl font-bold mb-2">Security Standards</h2>
            <p className="text-text-secondary text-lg mb-8">ScanSentinel follows OWASP Top 10 as a baseline for vulnerability detection and reporting.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {owaspCategories.map((category) => (
                <div key={category.id} className="rounded-xl border border-primary/20 bg-background/60 p-3 hover:border-primary/50 transition-colors">
                  <p className="text-primary text-xs font-mono font-bold">{category.id}</p>
                  <p className="text-sm font-semibold mt-1">{category.title}</p>
                  <p className="text-xs text-text-muted mt-2">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
