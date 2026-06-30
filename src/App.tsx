import React, { useState } from 'react';
import { Sidebar, Header } from './components/welfare/Layout';
import { Dashboard } from './components/welfare/Dashboard';
import { Members } from './components/welfare/Members';
import { Contributions } from './components/welfare/Contributions';
import { Loans } from './components/welfare/Loans';
import { Reports } from './components/welfare/Reports';
import { useWelfare } from './hooks/use-welfare';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    members, 
    contributions, 
    loans, 
    verifyContribution, 
    registerLoan, 
    repayLoan 
  } = useWelfare();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard members={members} contributions={contributions} loans={loans} />;
      case 'members':
        return <Members members={members} />;
      case 'contributions':
        return <Contributions contributions={contributions} onVerify={verifyContribution} />;
      case 'loans':
        return (
          <Loans 
            members={members} 
            loans={loans} 
            onRegisterLoan={registerLoan} 
            onRepayLoan={repayLoan} 
          />
        );
      case 'reports':
        return <Reports members={members} loans={loans} contributions={contributions} />;
      default:
        return <Dashboard members={members} contributions={contributions} loans={loans} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        <Header activeTab={activeTab} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      <Toaster position="top-right" expand={false} richColors />
    </div>
  );
}

export default App;
