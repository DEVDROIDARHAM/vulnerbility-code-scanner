import { getSeverityConfig } from "../../utils/severityMapper";

const Badge = ({
  children,
  severity,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const sevConfig = severity ? getSeverityConfig(severity) : null;
  
  const severityStyles = sevConfig
    ? {
        backgroundColor: `${sevConfig.color}15`,
        color: sevConfig.color,
        borderColor: `${sevConfig.color}30`,
      }
    : {};

  const variantClasses = {
    default: "bg-background-elevated text-text-secondary border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-severity-critical/10 text-severity-critical border-severity-critical/20",
  };

  const sizeClasses = {
    xs: "px-1 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-semibold rounded-md border
        font-mono uppercase tracking-wide leading-none
        ${!severity ? variantClasses[variant] || variantClasses.default : ""}
        ${sizeClasses[size] || sizeClasses.sm}
        ${className}
      `}
      style={severity ? severityStyles : {}}
    >
      {children}
    </span>
  );
};

export default Badge;
