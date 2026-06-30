import React from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  AlertTriangle, 
  Calendar,
  CheckCircle2,
  Users,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Member, Loan, Contribution } from '@/types/welfare';
import { cn } from '@/lib/utils';

interface ReportsProps {
  members: Member[];
  loans: Loan[];
  contributions: Contribution[];
}

export const Reports = ({ members, loans, contributions }: ReportsProps) => {
  const overdueMembers = members.filter(m => m.status === 'Overdue');
  const blacklistedMembers = members.filter(m => m.status === 'Blacklisted');
  
  const today = new Date().toISOString().split('T')[0];
  const todaysContributions = contributions.filter(c => c.date === today && c.status === 'Verified');
  const totalTodaysAmount = todaysContributions.reduce((acc, c) => acc + c.amount, 0);

  const reportSections = [
    {
      title: 'Daily Welfare Summary',
      date: 'Today, ' + new Date().toLocaleDateString(),
      stats: [
        { label: "Today's Verified", value: `KSh ${totalTodaysAmount.toLocaleString()}`, icon: Wallet },
        { label: 'New Members', value: '3', icon: Users },
        { label: 'Verifications Pending', value: contributions.filter(c => c.status === 'Pending').length.toString(), icon: AlertTriangle }
      ],
      type: 'summary'
    },
    {
      title: 'Member Health Alerts',
      date: 'Status check',
      stats: [
        { label: 'Overdue Members', value: overdueMembers.length.toString(), icon: AlertTriangle, variant: 'destructive' },
        { label: 'Blacklisted', value: blacklistedMembers.length.toString(), icon: FileText, variant: 'secondary' }
      ],
      type: 'alerts'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Reports</h2>
          <p className="text-muted-foreground">Automated insights and critical alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportSections.map((section, idx) => (
          <Card key={idx} className={cn("overflow-hidden", section.type === 'alerts' ? "border-destructive/20" : "")}>
            <CardHeader className={cn("pb-4", section.type === 'alerts' ? "bg-destructive/5" : "bg-muted/30")}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                <span className="text-xs text-muted-foreground">{section.date}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                {section.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-md", stat.variant === 'destructive' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Critical Attention Required
        </h3>
        
        <div className="space-y-3">
          {overdueMembers.slice(0, 5).map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center font-bold text-destructive">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">Loan Overdue for 15+ days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="animate-pulse">Overdue</Badge>
                <Button size="sm" variant="outline" className="h-8">Notify via WhatsApp</Button>
              </div>
            </div>
          ))}
          {overdueMembers.length > 5 && (
            <Button variant="link" className="w-full text-muted-foreground">
              View all {overdueMembers.length} overdue members
            </Button>
          )}
          {overdueMembers.length === 0 && (
            <div className="p-8 text-center border rounded-xl bg-muted/20">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No members currently overdue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
