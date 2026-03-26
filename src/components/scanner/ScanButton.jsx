import { Shield, Zap } from "lucide-react";
import Button from "../common/Button";

const ScanButton = ({ onClick, loading, disabled }) => {
  return (
    <div className="relative group">
      {/* Dynamic Glow Layer */}
      {!disabled && !loading && (
        <>
          <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-700 animate-glow" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-0 group-hover:opacity-30 transition duration-500" />
        </>
      )}
      
      <Button
        variant="primary"
        size="md"
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        className="relative px-6 h-11 font-extrabold tracking-widest font-display text-[11px] uppercase"
        icon={loading ? null : Zap}
      >
        {loading ? "Decrypting..." : "Run Security Analysis"}
      </Button>
    </div>
  );
};

export default ScanButton;
