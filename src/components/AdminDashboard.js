import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, useToast } from '@chakra-ui/react'; // Assuming Chakra UI is used for styling

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({}); // State to store selected roles
    const toast = useToast();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            };

            const res = await axios.get('http://localhost:5000/api/user', config);
            setUsers(res.data.users);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/${userId}`);
            toast({
                title: "User Deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            // After deletion, fetch updated user list
            fetchAllUsers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setSelectedRoles({ ...selectedRoles, [userId]: newRole }); // Update selected roles state
    };

    const handleRoleUpdate = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:5000/api/user/${userId}/role`, { role: selectedRoles[userId] }, config);
            toast({
                title: "Role Updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            // After role update, fetch updated user list
            fetchAllUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const renderUsers = () => {
        return users.map(user => (
            <li key={user._id}>
                <Box p="4" borderWidth="1px" borderRadius="md" shadow="md" marginBottom="4">
                    <h2 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>User Details</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Name:</h3>
                        <p>{user.name}</p>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Email:</h3>
                        <p>{user.email}</p>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Role:</h3>
                        <select value={selectedRoles[user._id] || user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                            <option value="user">User</option>
                            <option value="architect">Architect</option>
                            <option value="admin">Admin</option>
                        </select>
                        <Button colorScheme="teal" ml="2" onClick={() => handleRoleUpdate(user._id)}>Update Role</Button> {/* Button to trigger role update */}
                    </div>
                    <Button colorScheme="red" onClick={() => handleDeleteUser(user._id)}>Delete User</Button>
                </Box>
            </li>
        ));
    };

    return (
        <div className="dashboard-container" style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <div className="left-section" style={{ width: '100%', paddingRight: '20px', display: 'inline-block', textAlign: 'left' }}>
                <h1>Admin Dashboard</h1>
                {error && <p>Error: {error}</p>}
                <ul>
                    {renderUsers()}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
