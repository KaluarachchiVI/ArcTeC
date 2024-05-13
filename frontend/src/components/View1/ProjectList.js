import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Correct import for useHistory
import { fetchAllProjects, deleteProject } from "../../api-client";
import ProjectsCard from "./ProjectsCard";
import Button from "react-bootstrap/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory(); // Using useHistory here

  useEffect(() => {
    fetchAllProjects()
      .then((data) => {
        setProjects(data);
        console.log(data);
      })
      .catch((error) => {
        console.log("Error while getting data", error);
      });
  }, []);

  const onAdd = () => {
    history.push('/task/new'); // Correct navigation for adding new task
  };

  const onEdit = (project) => {
    const projectId = project?._id ?? 0;
    history.push(`/task/${projectId}`); // Navigate to edit task page
  };

  const onDelete = (project) => {
    deleteProject(project._id)
      .then(() => {
        setProjects(projects.filter((p) => p._id !== project._id));
      })
      .catch((error) => {
        console.log("Error while deleting project", error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectArchitect.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectsList = filteredProjects.map((project, index) => (
    <ProjectsCard
      key={index}
      project={project}
      onEdit={() => onEdit(project)}
      onDelete={() => onDelete(project)}
    />
  ));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button variant="primary" onClick={onAdd} style={{ margin: "1rem" }}>
          <FontAwesomeIcon icon={faPlus} /> Add New Project
        </Button>
        <form
          className="form-inline my-2 my-lg-0"
          style={{ display: "flex", alignItems: "center", margin: "1rem" }}
        >
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search by Architect Name"
            aria-label="Search"
            onChange={handleSearch}
            style={{ width: "225px", marginRight: "1rem" }}
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
      <div className="container">
        <div className="list">
          {projectsList}
        </div>
      </div>
    </>
  );
};

export default ProjectList;
