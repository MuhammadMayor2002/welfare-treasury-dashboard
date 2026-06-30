import { useState, useEffect, useCallback } from 'react';
import { WelfareStore, Member, Contribution, Loan } from '../types/welfare';
import { getStore, saveStore } from '../lib/store';

export function useWelfare() {
  const [store, setStore] = useState<WelfareStore>(() => getStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const verifyContribution = useCallback((contributionId: string) => {
    setStore(prev => {
      const contribution = prev.contributions.find(c => c.id === contributionId);
      if (!contribution || contribution.status !== 'Pending') return prev;

      const newContributions = prev.contributions.map(c => 
        c.id === contributionId ? { ...c, status: 'Verified' as const } : c
      );

      const newMembers = prev.members.map(m => 
        m.id === contribution.memberId 
          ? { 
              ...m, 
              balance: m.balance + contribution.amount,
              totalContributions: m.totalContributions + contribution.amount,
              status: m.status === 'Overdue' && m.totalLoans <= m.balance ? 'Active' as const : m.status
            } 
          : m
      );

      return { ...prev, contributions: newContributions, members: newMembers };
    });
  }, []);

  const registerLoan = useCallback((memberId: string, amount: number) => {
    setStore(prev => {
      const member = prev.members.find(m => m.id === memberId);
      if (!member) return prev;

      const interestRate = 10;
      const interest = amount * (interestRate / 100);
      const newLoan: Loan = {
        id: `LOAN-${Date.now()}`,
        memberId,
        memberName: member.name,
        amount,
        interestRate,
        totalToRepay: amount + interest,
        repaidAmount: 0,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active'
      };

      const newMembers = prev.members.map(m => 
        m.id === memberId 
          ? { ...m, totalLoans: m.totalLoans + amount } 
          : m
      );

      return {
        ...prev,
        loans: [newLoan, ...prev.loans],
        members: newMembers
      };
    });
  }, []);

  const repayLoan = useCallback((loanId: string, amount: number) => {
    setStore(prev => {
      const loan = prev.loans.find(l => l.id === loanId);
      if (!loan) return prev;

      const newRepaidAmount = loan.repaidAmount + amount;
      const isPaid = newRepaidAmount >= loan.totalToRepay;

      const newLoans = prev.loans.map(l => 
        l.id === loanId 
          ? { 
              ...l, 
              repaidAmount: newRepaidAmount, 
              status: isPaid ? 'Paid' as const : l.status 
            } 
          : l
      );

      const newMembers = prev.members.map(m => 
        m.id === loan.memberId 
          ? { 
              ...m, 
              balance: m.balance - amount,
              status: isPaid && m.status === 'Overdue' ? 'Active' as const : m.status
            } 
          : m
      );

      return { ...prev, loans: newLoans, members: newMembers };
    });
  }, []);

  return {
    ...store,
    verifyContribution,
    registerLoan,
    repayLoan
  };
}
