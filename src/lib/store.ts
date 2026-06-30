import { Member, Contribution, Loan, WelfareStore } from '../types/welfare';

const STORAGE_KEY = 'iwms_data';

const INITIAL_MEMBER_COUNT = 421;

const generateMockMembers = (): Member[] => {
  const members: Member[] = [];
  const statuses: Member['status'][] = ['Active', 'Active', 'Active', 'Active', 'Overdue', 'Blacklisted'];
  
  for (let i = 1; i <= INITIAL_MEMBER_COUNT; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const balance = Math.floor(Math.random() * 5000) + 1000;
    const totalContributions = balance + Math.floor(Math.random() * 2000);
    const totalLoans = status === 'Active' ? 0 : Math.floor(Math.random() * 3000);

    members.push({
      id: `MEM-${1000 + i}`,
      name: `Member ${i}`,
      email: `member${i}@example.com`,
      phone: `+254 7${Math.floor(10000000 + Math.random() * 90000000)}`,
      balance,
      totalContributions,
      totalLoans,
      status,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Member${i}`
    });
  }
  return members;
};

const generateMockContributions = (members: Member[]): Contribution[] => {
  const contributions: Contribution[] = [];
  const count = 20;
  
  for (let i = 1; i <= count; i++) {
    const member = members[Math.floor(Math.random() * members.length)];
    contributions.push({
      id: `CON-${5000 + i}`,
      memberId: member.id,
      memberName: member.name,
      amount: 1000 + Math.floor(Math.random() * 4000),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      paymentMethod: 'MPESA',
      reference: `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    });
  }
  return contributions;
};

const generateMockLoans = (members: Member[]): Loan[] => {
  const overdueMembers = members.filter(m => m.status === 'Overdue');
  return overdueMembers.map((member, i) => {
    const amount = 5000 + Math.floor(Math.random() * 15000);
    const interest = amount * 0.1;
    return {
      id: `LOAN-${2000 + i}`,
      memberId: member.id,
      memberName: member.name,
      amount,
      interestRate: 10,
      totalToRepay: amount + interest,
      repaidAmount: Math.floor(Math.random() * (amount / 2)),
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Overdue'
    };
  });
};

export const getStore = (): WelfareStore => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const members = generateMockMembers();
  const contributions = generateMockContributions(members);
  const loans = generateMockLoans(members);
  
  const initialStore: WelfareStore = {
    members,
    contributions,
    loans
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
  return initialStore;
};

export const saveStore = (store: WelfareStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};
