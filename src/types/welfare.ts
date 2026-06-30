export type MemberStatus = 'Active' | 'Overdue' | 'Blacklisted';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  totalContributions: number;
  totalLoans: number;
  status: MemberStatus;
  joinDate: string;
  avatar?: string;
}

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  paymentMethod: string;
  reference: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  totalToRepay: number;
  repaidAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'Active' | 'Paid' | 'Overdue';
}

export interface WelfareStore {
  members: Member[];
  contributions: Contribution[];
  loans: Loan[];
}
