import React from 'react';
import { 
  Users, 
  Wallet, 
  HandCoins, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member, Contribution, Loan } from '@/types/welfare';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  members: Member[];
  contributions: Contribution[];
  loans: Loan[];
}

export const Dashboard = ({ members, contributions, loans }: DashboardProps) => {
  const totalBalance = members.reduce((acc, m) => acc + m.balance, 0);
  const totalLoans = loans.filter(l => l.status !== 'Paid').reduce((acc, l) => acc + (l.totalToRepay - l.repaidAmount), 0);
  const pendingVerifications = contributions.filter(c => c.status === 'Pending').length;
  const overdueMembers = members.filter(m => m.status === 'Overdue').length;

  const stats = [
    { 
      label: 'Total Members', 
      value: members.length, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Total Fund Balance', 
      value: `KSh ${totalBalance.toLocaleString()}`, 
      icon: Wallet, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      change: '+8.4%',
      trend: 'up'
    },
    { 
      label: 'Active Loans', 
      value: `KSh ${totalLoans.toLocaleString()}`, 
      icon: HandCoins, 
      color: 'text-amber-600', 
      bg: 'bg-amber-100',
      change: '-2.1%',
      trend: 'down'
    },
    { 
      label: 'Pending Verifications', 
      value: pendingVerifications, 
      icon: AlertCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      change: 'Action Required',
      trend: 'none'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.trend !== 'none' && (
                  <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                  </div>
                )}
                {stat.trend === 'none' && (
                   <span className="text-xs font-medium text-muted-foreground">{stat.change}</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributions.filter(c => c.status === 'Pending').slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                      {c.memberName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{c.memberName}</p>
                      <p className="text-xs text-muted-foreground">{c.date} • {c.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KSh {c.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1">Pending</Badge>
                  </div>
                </div>
              ))}
              {contributions.filter(c => c.status === 'Pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending verifications at the moment.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Welfare Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Active Members</span>
                </div>
                <span className="font-bold">{members.filter(m => m.status === 'Active').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Overdue Loans</span>
                </div>
                <span className="font-bold">{overdueMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Blacklisted</span>
                </div>
                <span className="font-bold">{members.filter(m => m.status === 'Blacklisted').length}</span>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-bold mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm" className="justify-start">
                     <TrendingUp className="w-4 h-4 mr-2" />
                     New Report
                   </Button>
                   <Button variant="outline" size="sm" className="justify-start">
                     <AlertCircle className="w-4 h-4 mr-2" />
                     Alert All
                   </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
