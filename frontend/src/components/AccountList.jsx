import { getUserAccounts, deleteUserAccount } from '../services/api';
import React, { useEffect, useState, useRef } from 'react';

// const accounts = [
//     {id: 1, userid: 1, accountNumber: "1234567890", balance: "100", type: "Checking"},
//     {id: 2, userid: 1, accountNumber: "0987654321", balance: "200", type: "Savings"},
//     {id: 3, userid: 2, accountNumber: "1234567890", balance: "100", type: "Checking"},
//     {id: 4, userid: 2, accountNumber: "0987654321", balance: "200", type: "Savings"},
// ];

function AccountList({ userId, onBack }) {

    const [accounts, setAccounts] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const timerRef = useRef(null);

    const fetchAccounts = (id) => {
        getUserAccounts(id)
            .then(response => setAccounts(response.data))
            .catch(error => console.error(error));
    };

    const deleteAccount = async (accountId) => {
        try {
            setDeleting(true);

            await deleteUserAccount(userId, accountId);
            fetchAccounts(userId);
            setMessage('Account deleted successfully!');
            // clear any previous timer
            if (timerRef.current) clearTimeout(timerRef.current);
            // remove message after 3 seconds
            timerRef.current = setTimeout(() => setMessage(''), 3000);
        }catch(error){
            console.error("Failed to delete account:" + error);
            setMessage('Failed to delete account');
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setMessage(''), 3000);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAccounts(userId);
        }
    }, [userId]);

    // cleanup any pending timers on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);
    
    if (!userId) {
        return null;
    }

    const listOfAccounts = accounts.map(account =>
        <tr key={account.id}>
            <td> {account.id} </td>
            <td> {account.accountNumber} </td>
            <td> {account.balance} </td>
            <td> {account.type} </td>
            <td>
                <button onClick={() => deleteAccount(account.id)} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
            </td>

        </tr>
    )

        return (
        <div className="center">
            <h1>Account List</h1>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>Hide Account Table</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ACCOUNT NO.</th>
                        <th>BALANCE</th>
                        <th>TYPE</th>
                        <th>BUTTON</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfAccounts}
                </tbody>
            </table>
            {message && (
                <div style={{ marginTop: '12px', color: message.startsWith('Failed') ? 'red' : 'green' }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default AccountList;