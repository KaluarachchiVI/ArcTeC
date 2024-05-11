import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, useToast } from '@chakra-ui/react'; // Assuming Chakra UI is used for styling

const ArchitectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [architectName, setArchitectName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchArchitectName();
    }, []);

    useEffect(() => {
        if (architectName) {
            fetchProjectsByArchitect();
        }
    }, [architectName]);

    const fetchArchitectName = async () => {
        try {
            const name = localStorage.getItem('name');
            setArchitectName(name);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchProjectsByArchitect = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/architect/${architectName}`);
            setProjects(res.data.projects);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/search?searchQuery=${searchQuery}`);
            setProjects(res.data.projects);
        } catch (error) {
            setError(error.message);
        }
    };

    const renderProjects = () => {
        return projects.map(project => (
            <li key={project._id}>
                <Box p="4" borderWidth="1px" borderRadius="md" shadow="md" marginBottom="4">
                    <h2 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Project Details</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Project Name:</h3>
                        <p>{project.pName}</p>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Description:</h3>
                        <p>{project.Des}</p>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Client Name:</h3>
                        <p>{project.cName}</p>
                    </div>
                </Box>
            </li>
        ));
    };

    return (
        <div className="dashboard-container" style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <div className="left-section" style={{ width: '50%', paddingRight: '20px', display: 'inline-block', textAlign: 'left' }}>
                <h1>Architect Dashboard</h1>
                {error && <p>Error: {error}</p>}
                <h2>Welcome, {architectName}</h2>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button onClick={handleSearch}>Search</Button>
                <ul>
                    {renderProjects()}
                </ul>
            </div>
            <div className="right-section" style={{ width: '50%', paddingLeft: '20px', display: 'inline-block', textAlign: 'left' }}>
                {/* Add any additional content for the right section here */}
            </div>
        </div>
    );
};

export default ArchitectDashboard;
