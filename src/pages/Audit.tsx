import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, Copy, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock audit records - in production, this would come from an API
const auditRecords = [
  {
    id: 1,
    uid: "USR-00X23-KV",
    hash: "0xa7f92e9F5b332aaA12d",
    block: 744642,
    timestamp: "2025-10-20 10:49 UTC",
    status: "verified",
  },
  {
    id: 2,
    uid: "USR-00X23-KV",
    hash: "0xb8g03f0G6c443bbB23e",
    block: 744641,
    timestamp: "2025-10-20 10:48 UTC",
    status: "verified",
  },
  {
    id: 3,
    uid: "USR-00X23-KV",
    hash: "0xc9h14g1H7d554ccC34f",
    block: 744640,
    timestamp: "2025-10-20 10:47 UTC",
    status: "verified",
  },
] as const;

interface AuditRecord {
  id: number;
  uid: string;
  hash: string;
  block: number;
  timestamp: string;
  status: "verified" | "pending" | "failed";
}

const Audit = () => {
  const [isExporting, setIsExporting] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const exportProofLog = async () => {
    setIsExporting(true);
    try {
      const csvContent = [
        ['UID', 'Hash', 'Block', 'Timestamp', 'Status'],
        ...auditRecords.map(record => [
          record.uid,
          record.hash,
          record.block.toString(),
          record.timestamp,
          record.status
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-proof-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Audit log exported successfully");
    } catch (error) {
      console.error('Failed to export audit log:', error);
      toast.error("Failed to export audit log");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Audit Log & Blockchain Hash Recorder</h1>
        <p className="text-muted-foreground">Immutable on-chain records of all activations</p>
      </div>

      {/* Alert Banner */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <span className="font-semibold text-primary">AEI Sentinel</span> has identified{" "}
            <span className="text-primary font-semibold">1 proof event</span> requiring verification
          </p>
        </div>
      </Card>

      {/* Blockchain Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">CURRENT BLOCK</p>
          <p className="text-2xl font-bold text-primary">744,642</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">VERIFIED RECORDS</p>
          <p className="text-2xl font-bold">127</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">PENDING</p>
          <p className="text-2xl font-bold">1</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">LATENCY</p>
          <p className="text-2xl font-bold text-primary">122ms</p>
        </Card>
      </div>

      {/* Current Hash */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="text-lg font-bold mb-4">Current Blockchain Hash</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-secondary/50 rounded-lg p-4 font-mono text-sm break-all">
            0xa7f92e9F5b332aaA12d
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-primary/30"
            onClick={() => copyToClipboard("0xa7f92e9F5b332aaA12d")}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            VERIFIED ON-CHAIN
          </Badge>
          <Button variant="link" className="text-primary h-auto p-0" size="sm">
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Explorer
          </Button>
        </div>
      </Card>

      {/* Recent Activations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent Activations</h3>
          <Button 
            variant="outline" 
            className="border-primary/30" 
            size="sm" 
            onClick={exportProofLog}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Proof Log"}
          </Button>
        </div>

        <div className="space-y-3">
          {auditRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    {record.uid}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{record.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono truncate">{record.hash}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(record.hash)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Block: {record.block}</p>
              </div>

              <Badge className="bg-primary/20 text-primary border-primary/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {record.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Hash Verification Tool */}
      <Card className="p-6 border-primary/20">
        <h3 className="text-lg font-bold mb-4">Hash Verification Tool</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Verify any blockchain hash to confirm authenticity and timestamp
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter blockchain hash..."
            className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:border-primary/50"
          />
          <Button className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
            Verify Hash
          </Button>
        </div>
      </Card>

      {/* AEI Sentinel Status */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">AEI SENTINEL</h4>
            <p className="text-sm text-muted-foreground">Powered by AI</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
            ACTIVE
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default Audit;
