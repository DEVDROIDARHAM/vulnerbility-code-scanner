import { FileSearch } from "lucide-react";

const EmptyState = ({
  icon: Icon = FileSearch,
  title = "No data found",
  description = "",
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="p-4 rounded-2xl bg-bg-elevated border border-border mb-4">
        <Icon size={40} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2 font-mono">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
