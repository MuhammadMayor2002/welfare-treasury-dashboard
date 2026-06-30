import React, { useState } from 'react';
import { 
  HandCoins, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  History
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
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Member, Loan } from '@/types/welfare';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LoansProps {
  members: Member[];
  loans: Loan[];
  onRegisterLoan: (memberId: string, amount: number) => void;
  onRepayLoan: (loanId: string, amount: number) => void;
}

export const Loans = ({ members, loans, onRegisterLoan, onRepayLoan }: LoansProps) => {
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeLoans = loans.filter(l => l.status !== 'Paid');
  const paidLoans = loans.filter(l => l.status === 'Paid');

  const handleRegister = () => {
    if (!selectedMember || !amount || isNaN(Number(amount))) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    
    const member = members.find(m => m.id === selectedMember);
    if (!member) return;

    if (member.status === 'Blacklisted') {
      toast.error("Blacklisted members cannot receive loans.");
      return;
    }

    onRegisterLoan(selectedMember, Number(amount));
    toast.success(`Loan of KSh ${Number(amount).toLocaleString()} registered for ${member.name}`);
    setIsDialogOpen(false);
    setAmount('');
    setSelectedMember('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Loan Management</h2>
          <p className="text-muted-foreground">Track member loans and repayments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Register New Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Member Loan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member">Select Member</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {members.filter(m => m.status !== 'Blacklisted').map(m => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.id}) — Balance: KSh {m.balance.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (KSh)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="e.g. 5000" 
                    className="pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Standard 10% interest rate will be applied automatically.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRegister}>Confirm Registration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat 
          label="Total Disbursed" 
          value={loans.reduce((acc, l) => acc + l.amount, 0)} 
          icon={TrendingUp} 
          color="text-blue-600" 
        />
        <CardStat 
          label="Pending Repayment" 
          value={activeLoans.reduce((acc, l) => acc + (l.totalToRepay - l.repaidAmount), 0)} 
          icon={HandCoins} 
          color="text-amber-600" 
        />
        <CardStat 
          label="Fully Repaid" 
          value={paidLoans.length} 
          icon={History} 
          color="text-green-600" 
          isCount
        />
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          Active Loans
          <Badge variant="outline" className="ml-2">{activeLoans.length}</Badge>
        </h3>
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Member</TableHead>
                <TableHead>Loan Details</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <p className="font-semibold text-sm">{loan.memberName}</p>
                    <p className="text-[10px] text-muted-foreground">{loan.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-bold">KSh {loan.amount.toLocaleString()}</p>
                      <p className="text-muted-foreground">Total: KSh {loan.totalToRepay.toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>KSh {loan.repaidAmount.toLocaleString()} repaid</span>
                        <span>{Math.round((loan.repaidAmount / loan.totalToRepay) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all" 
                          style={{ width: `${(loan.repaidAmount / loan.totalToRepay) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {loan.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[10px] rounded-full",
                      loan.status === 'Overdue' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                    )}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8 text-primary hover:bg-primary/10"
                      onClick={() => onRepayLoan(loan.id, 500)} // Mocking a quick repayment
                    >
                      Log Repayment
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {activeLoans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No active loans found.
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

const CardStat = ({ label, value, icon: Icon, color, isCount }: any) => (
  <div className="bg-card border rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-lg bg-muted", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      {!isCount && <span className="text-sm font-semibold text-muted-foreground">KSh</span>}
      <h4 className="text-2xl font-bold">{value.toLocaleString()}</h4>
    </div>
  </div>
);
