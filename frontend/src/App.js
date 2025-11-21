import './App.css';
import UserList from './components/UserList';
import AccountList from './components/AccountList';
import UserForm from './components/UserForm';
import { useState } from 'react';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setRefreshKey(prev => prev + 1); // Trigger UserList refresh
  };

  return (
    <div className="App">

      <div className="user-form-container">
        <UserForm onUserCreated={handleUserCreated} />
      </div>
      
      <UserList refreshKey={refreshKey} />

    </div>
  );
}

export default App;
