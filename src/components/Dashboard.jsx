import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, useToast } from '@chakra-ui/react'; // Assuming Chakra UI is used for styling
import { Box } from '@chakra-ui/react';

const Dashboard = () => {
    const [userProjects, setProjects] = useState([]);
    const [projectData, setProjectData] = useState({ pName: '', Des: '', cName: '', architect: '' }); // Added architect field
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [architects, setArchitects] = useState([]); // State to store list of architects
    const toast = useToast();

    useEffect(() => {
        fetchProjects();
        fetchArchitects(); // Fetch list of architects when component mounts
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.get(`http://localhost:5000/api/projects/user/${userId}`, config);
            setProjects(res.data.userProjects); // Update to match the response structure
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchArchitects = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.get(`http://localhost:5000/api/user/architects`, config); // Assuming there's an endpoint to fetch architects
            setArchitects(res.data.architects); // Assuming the response contains a list of architects
        } catch (error) {
            console.error('Error fetching architects:', error);
        }
    };

    const handleInputChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.get(`http://localhost:5000/api/projects/search?searchQuery=${searchQuery}`, config);
            setProjects(res.data.projects);
        } catch (error) {
            console.error('Error searching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // Use projectData.architect to get the selected architect
            const projectDataWithArchitect = { ...projectData, architectName: projectData.architect }; 
            if (editingProjectId) {
                // Update existing project
                await axios.put(`http://localhost:5000/api/projects/update/${editingProjectId}`, projectDataWithArchitect, config);
                toast({
                    title: "Project Updated",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Create new project
                await axios.post('http://localhost:5000/api/projects/create', projectDataWithArchitect, config);
                toast({
                    title: "Project Created",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
            fetchProjects();
            setProjectData({ pName: '', Des: '', cName: '', architect: '' }); // Clear the project data after submission
            setEditingProjectId(null);
        } catch (error) {
            console.error('Error creating/updating project:', error);
        }
    };
    

    const handleDelete = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:5000/api/projects/delete/${projectId}`, config);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (projectId) => {
        // Find the project by ID
        const projectToEdit = userProjects.find(project => project._id === projectId);
        // Set the project data to populate the form fields
        setProjectData({
            pName: projectToEdit.pName,
            Des: projectToEdit.Des,
            cName: projectToEdit.cName,
            architect: projectToEdit.architect // Assuming architect field is stored in the project object
        });
        // Set the editing project ID
        setEditingProjectId(projectId);
    };

    const projectListItems = userProjects.map(project => (
        <li key={project._id}>
            <Box p="4" borderWidth="1px" borderRadius="md" shadow="md">
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
                <div style={{ marginTop: '10px' }}>
                    <Button onClick={() => handleDelete(project._id)} marginRight="4">Delete Project</Button>
                    <Button onClick={() => handleEdit(project._id)}>Edit Project</Button>
                </div>
            </Box>
        </li>
    ));

    return (
        <div className="dashboard-container" style={{ display: 'flex' }}>
            <div className="left-section" style={{ width: '50%', paddingRight: '20px', textAlign: 'left' }}>
                <h1>Dashboard</h1>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button onClick={handleSearch}>Search</Button>
                <h2>Projects</h2>
                <ul>
                    {projectListItems}
                </ul>
            </div>
            <div className="right-section" style={{ width: '50%', paddingLeft: '20px', textAlign: 'left' }}>
                <h2>{editingProjectId ? 'Edit Project' : 'Create New Project'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Project Name:
                        <input type="text" name="pName" value={projectData.pName} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea name="Des" value={projectData.Des} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label>
                        Client Name:
                        <input type="text" name="cName" value={projectData.cName} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label>
                    Architect: 
                        <select name="architect" value={projectData.architect} onChange={handleInputChange}>
                        <option value="">Select Architect</option>
                        {architects.map(architect => (
                            <option key={architect} value={architect}>{architect}</option>
                            ))}
                        </select>
                     </label>

                    <br />
                    <button type="submit">{editingProjectId ? 'Update Project' : 'Create Project'}</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
