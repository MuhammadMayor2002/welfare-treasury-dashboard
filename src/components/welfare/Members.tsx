import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  UserMinus, 
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Member } from '@/types/welfare';
import { cn } from '@/lib/utils';

interface MembersProps {
  members: Member[];
}

export const Members = ({ members }: MembersProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                           m.id.toLowerCase().includes(search.toLowerCase()) ||
                           m.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Overdue': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Blacklisted': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-xl border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, ID or email..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'Active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('Active')}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'Overdue' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('Overdue')}
          >
            Overdue
          </Button>
          <Button 
            variant={statusFilter === 'Blacklisted' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('Blacklisted')}
          >
            Blacklisted
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">Member ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Loans</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs">{member.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">Joined: {member.joinDate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full text-[10px]", getStatusColor(member.status))}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm">
                    KSh {member.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    <span className={cn(member.totalLoans > 0 ? "text-amber-600 font-medium" : "text-muted-foreground")}>
                      KSh {member.totalLoans.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <UserPlus className="w-4 h-4" /> Grant Loan
                        </DropdownMenuItem>
                        {member.status !== 'Blacklisted' ? (
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <UserMinus className="w-4 h-4" /> Blacklist
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-green-600">
                            <UserPlus className="w-4 h-4" /> Restore Status
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 opacity-20" />
                      <p>No members found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
