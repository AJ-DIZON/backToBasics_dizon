import { getUserAccounts, deleteUserAccount } from '../services/api';
import { useEffect, useState, useRef } from 'react';

function AccountList({ userId, onBack }) {

    const [accounts, setAccounts] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const timerRef = useRef(null);

    const fetchAccounts = async (id) => {
        try {
            const response = await getUserAccounts(id);
            setAccounts(response.data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        }
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