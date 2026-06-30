import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Contribution } from '@/types/welfare';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ContributionsProps {
  contributions: Contribution[];
  onVerify: (id: string) => void;
}

export const Contributions = ({ contributions, onVerify }: ContributionsProps) => {
  const pending = contributions.filter(c => c.status === 'Pending');
  const history = contributions.filter(c => c.status !== 'Pending');

  const handleVerify = (id: string, name: string) => {
    onVerify(id);
    toast.success(`Payment from ${name} verified successfully!`);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Verifications
            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
              {pending.length}
            </Badge>
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open Google Form Responses
          </Button>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Member Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method & Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-semibold text-sm">{c.memberName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{c.memberId}</p>
                  </TableCell>
                  <TableCell className="font-bold">KSh {c.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{c.paymentMethod}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{c.reference}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{c.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerify(c.id, c.memberName)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                    All clear! No pending payments to verify.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Verification History
        </h2>
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm opacity-80">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((c) => (
                <TableRow key={c.id} className="text-xs">
                  <TableCell className="font-medium">{c.memberName}</TableCell>
                  <TableCell className="font-bold">KSh {c.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{c.reference}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[9px] px-1.5 py-0",
                      c.status === 'Verified' ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"
                    )}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{c.date}</TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No history records yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};
