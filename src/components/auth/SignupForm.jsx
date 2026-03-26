import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Github,
  Chrome,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Simple password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const success = await signup(name, email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Account registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor =
    passwordStrength <= 25
      ? "bg-severity-critical"
      : passwordStrength <= 50
      ? "bg-severity-high"
      : passwordStrength <= 75
      ? "bg-severity-medium"
      : "bg-success";

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-severity-critical/10 border border-severity-critical/20 text-severity-critical text-xs flex items-center gap-2 animate-fade-in">
            <ShieldAlert size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <User size={16} />
            </div>
            <input
              type="text"
              required
              className="block w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <Mail size={16} />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="block w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength Meter */}
          <div className="pt-1.5 space-y-1.5">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-muted">
               <span>Strength</span>
               <span className={passwordStrength > 50 ? 'text-success' : ''}>{passwordStrength}%</span>
             </div>
             <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
               <div
                 className={`h-full transition-all duration-500 ${strengthColor}`}
                 style={{ width: `${passwordStrength}%` }}
               />
             </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="block w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 pt-2 cursor-pointer group">
          <div className="pt-0.5">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/20 transition-all cursor-pointer"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>
          <span className="text-xs text-text-secondary leading-normal group-hover:text-text-primary transition-colors">
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
          </span>
        </label>

        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold mt-2"
          loading={loading}
          iconRight={UserPlus}
        >
          Create Free Account
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest leading-none">
          <span className="bg-background-surface px-3 text-text-muted font-bold">
            Social Sign Up
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="https://github.com/DEVDROIDARHAM" target="_blank" rel="noreferrer">
          <Button variant="outline" className="h-11 text-xs gap-2.5 w-full">
            <Github size={16} />
            GitHub
          </Button>
        </a>
        <Button variant="outline" className="h-11 text-xs gap-2.5">
          <Chrome size={16} />
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-text-secondary pt-2">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-primary hover:text-primary-light transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;

// Dummy icon for internal use if missing
function ShieldAlert({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
