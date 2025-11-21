import { getUsers, addAccountForUser, deleteUser } from '../services/api';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import AccountList from './AccountList';

function UserList({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [formAccount, setFormAccount] = useState({ balance: '', type: 'Checking' });  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedAccountUserId, setSelectedAccountUserId] = useState(null);
  
  const [message, setMessage] = useState('');

  const fetchUsers = () => {  
    getUsers()
      .then(response => {
        console.log('API Response:', response);
        const userData = Array.isArray(response.data) ? response.data : response.data.users || response.data;
        setUsers(userData);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAccount(prev => ({ ...prev, [name]: value }));
  };

  const openAddAccountModal = (userId) => {

    setSelectedUserId(userId);
    setFormAccount({ balance: '', type: 'Checking' });
    setIsModalOpen(true);

  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try{
      if(formAccount.balance && formAccount.type){

        await addAccountForUser(selectedUserId, formAccount);
        setIsModalOpen(false);
        setSelectedUserId(null);
        setFormAccount({ balance: '', type: 'Checking' });
        setMessage('Account created successfully!');

        setSelectedAccountUserId(selectedUserId);

        
      }else{
        setMessage('Please fill in all fields');
      }
    }catch(error){
      console.error("Error fetching accounts: " + error);
      setMessage('Error fetching accounts');
    }
  }

  const handleDeleteUser = async (userId) => {
    setMessage('');
    
    try {
      await deleteUser(userId);
      fetchUsers();
      setMessage('User deleted successfully!');

    }catch(error){
      console.error("Error deleting user: " + error);
      setMessage('Error deleting user');
    }
  }

  //map users to display in table
  const listOfUsers = users.map(user => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>
        <button onClick={() => openAddAccountModal(user.id)}>Add new accounts</button>
      </td>
      <td>
        <button onClick={() => setSelectedAccountUserId(user.id)}>View Accounts</button>
      </td>
      <td>
        <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
      </td>
    </tr>
  ));

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);
  return (
    <div className="center">
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th colSpan={4}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {listOfUsers}
        </tbody>
      </table>

      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}

      <AccountList userId={selectedAccountUserId} onBack={() => setSelectedAccountUserId(null)} />

      {isModalOpen && (
        <Modal title="Add Account" onClose={() => { setIsModalOpen(false); setSelectedUserId(null); }}>
          <form>
            <p>
              <label>Balance: </label>
              <input
                type="text"
                name="balance"
                placeholder="Initial Balance"
                value={formAccount.balance}
                onChange={handleChange}
              />
            </p>

            <p>
              <label>Type: </label>
              <select name="type" value={formAccount.type} onChange={handleChange}>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
                <option value="Time Deposits">Time Deposits</option>
              </select>
            </p>
            
            <p>
              <button type="submit" onClick={handleAddAccount}>Create Account</button>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default UserList;