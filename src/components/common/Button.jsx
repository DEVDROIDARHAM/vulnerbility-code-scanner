import { forwardRef } from "react";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-light shadow-glow animate-glow btn-glow",
  secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 active:bg-white/20 active:scale-95",
  outline: "bg-transparent border border-white/10 text-white hover:bg-white/5 active:bg-white/10",
  ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
  danger: "bg-severity-critical/10 text-severity-critical border border-severity-critical/20 hover:bg-severity-critical/20",
  success: "bg-severity-low/10 text-severity-low border border-severity-low/20 hover:bg-severity-low/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
  md: "px-5 py-2.5 text-sm font-bold gap-2",
  lg: "px-8 py-4 text-base font-extrabold gap-3",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      loading = false,
      icon: Icon,
      iconRight: IconRight,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg
          font-medium transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : Icon ? (
          <Icon size={16} />
        ) : null}
        <span className="leading-none">{children}</span>
        {IconRight && !loading && <IconRight size={16} />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
