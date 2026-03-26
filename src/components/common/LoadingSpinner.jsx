const LoadingSpinner = ({ size = "md", text = "", className = "" }) => {
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeMap[size]} border-2 border-border rounded-full animate-spin`}
          style={{ borderTopColor: "#00f5ff" }}
        />
        <div
          className={`absolute inset-0 ${sizeMap[size]} border-2 border-transparent rounded-full animate-spin`}
          style={{
            borderBottomColor: "rgba(0, 245, 255, 0.3)",
            animationDuration: "1.5s",
            animationDirection: "reverse",
          }}
        />
      </div>
      {text && (
        <p className="text-sm text-text-secondary font-mono animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
