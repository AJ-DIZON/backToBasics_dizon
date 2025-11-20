import logo from './logo.svg';
import './App.css';
import UserList from './components/UserList';
import AccountList from './components/AccountList';
import UserForm from './components/UserForm';
import React, { useState } from 'react';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setRefreshKey(prev => prev + 1); // Trigger UserList refresh
  };

  return (
    <div className="App">
      <UserList refreshKey={refreshKey} />
      <UserForm onUserCreated={handleUserCreated} />
      <AccountList userId={selectedAccountUserId} onBack={() => setSelectedAccountUserId(null)} />
    </div>
  );
}

export default App;
