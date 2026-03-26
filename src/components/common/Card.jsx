const Card = ({
  children,
  className = "",
  glow = false,
  hover = false,
  padding = "p-6",
  ...props
}) => {
  return (
    <div
      className={`
        bg-background-surface border border-border rounded-xl transition-all duration-300
        ${padding}
        ${glow ? "shadow-glow border-primary/20" : ""}
        ${hover ? "hover:border-primary/40 hover:shadow-glow-lg" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
