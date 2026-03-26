import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Github, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-severity-critical/10 border border-severity-critical/20 text-severity-critical text-xs flex items-center gap-2 animate-fade-in">
            <Lock size={14} />
            {error}
          </div>
        )}

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
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-primary hover:text-primary-light transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold"
          loading={loading}
          iconRight={LogIn}
        >
          Sign In to ScanSentinel
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest leading-none">
          <span className="bg-background-surface px-3 text-text-muted font-bold">
            Or continue with
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
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-bold text-primary hover:text-primary-light transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
