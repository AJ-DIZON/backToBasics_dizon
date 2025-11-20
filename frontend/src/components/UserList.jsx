import { getUsers, addAccountForUser } from '../services/api';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import AccountList from './AccountList';

// const users = [
//   {id: 1, name: "John", email: "john@email.com", phone: "123-456-7890"},
//   {id: 2, name: "Jane", email: "jane@email.com", phone: "987-654-3210"},
//   {id: 3, name: "Bob", email: "bob@email.com", phone: "555-555-5555"},
// ]

function UserList({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedAccountUserId, setSelectedAccountUserId] = useState(null);
  const [formAccount, setFormAccount] = useState({ balance: '', type: 'Checking' });

  const fetchUsers = () => {  
    getUsers()
      .then(response => {
        console.log('API Response:', response);
        // Handle both array and object with users property
        const userData = Array.isArray(response.data) ? response.data : response.data.users || response.data;
        setUsers(userData);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAccount(prev => ({ ...prev, [name]: value }));
  };

  const openAddAccountModal = (userId) => {
    setSelectedUserId(userId);
    setFormAccount({ balance: '', type: 'Checking' });
    setIsModalOpen(true);
  };

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
        {/* delete user and all accounts */}
        <button onClick={() => console.log('Delete user', user.id)}>Delete User</button>
      </td>
    </tr>
  ));

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
              <button type="submit">Create Account</button>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default UserList;