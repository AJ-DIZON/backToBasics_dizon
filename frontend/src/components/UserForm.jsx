import { addUser, getUsers } from '../services/api';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from './Modal';

function UserForm({ onUserCreated }) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const timerRef = useRef(null);
    const SUCCESS_TIMEOUT_MS = 2000; // milliseconds to wait after success before closing/clearing

        // Clear timer if modal is closed manually or on unmount
        useEffect(() => {
            if (!isModalOpen && timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }, [isModalOpen]);
    
    // Handle input changes - UPDATE state when user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle form submission - POST data to backend
    const handleData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            addUser(formData);
            setMessage('User created successfully!');
            console.log(formData.data);

            // Clear form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: ''
            });

            // Trigger parent to refresh UserList
            if (onUserCreated) {
                onUserCreated();
            }

            // Show success message briefly, then close modal and clear message
            // Clear any existing timer first
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setIsModalOpen(false);
                setMessage('');
                timerRef.current = null;
            }, SUCCESS_TIMEOUT_MS);
        } catch (error) {
            setMessage('Error creating user: ' + (error.response?.data?.message || error.message));
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
    <div>
    <h1>User Form</h1>

    <button onClick={() => setIsModalOpen(true)}>Create New User</button>
    
    {isModalOpen && <Modal title="Create New User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>
        <label>Name: </label>
        <input 
            placeholder="Name" 
            name="name"
            value={formData.name} 
            onChange={handleChange}
            type="text" 
        />
        </p>

        <p>
        <label>E-mail: </label>
        <input 
            placeholder="Email" 
            name="email"
            value={formData.email} 
            onChange={handleChange}
            type="email" 
        />
        </p>

        <p>
        <label>Phone: </label>
        <input 
            placeholder="Phone" 
            name="phone"
            value={formData.phone} 
            onChange={handleChange}
            type="tel" 
        />
        </p>

        <p>
        <button onClick={handleData} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
        </button>
        </p>

        {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}

    </Modal>}
    
    </div>
    );
}  

export default UserForm;