import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import ActiveCalls from './components/pages/ActiveCalls';
import APIGuide from './components/pages/APIGuide';
import Requests from './components/pages/Requests';
import CallHistory from './components/pages/CallHistory';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('active-calls');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'active-calls':
        return <ActiveCalls />;
      case 'api-guide':
        return <APIGuide />;
      case 'requests':
        return <Requests />;
      case 'history':
        return <CallHistory />;
      default:
        return <ActiveCalls />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;