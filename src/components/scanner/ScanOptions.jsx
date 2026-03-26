import { Terminal, Code, CheckCircle2 } from "lucide-react";
import Button from "../common/Button";
import { sampleVulnerableCode, sampleCleanCode } from "../../services/mockData";

const ScanOptions = ({ onLoadSample }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        icon={Code}
        onClick={() => onLoadSample(sampleVulnerableCode)}
        className="text-[11px] font-bold uppercase tracking-wider"
      >
        Vulnerable Sample
      </Button>
      <Button
        variant="ghost"
        size="sm"
        icon={CheckCircle2}
        onClick={() => onLoadSample(sampleCleanCode)}
        className="text-[11px] font-bold uppercase tracking-wider"
      >
        Secure Sample
      </Button>
    </div>
  );
};

export default ScanOptions;
