import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddDocument = () => {
  const [Customer_Id, setCustomer_Id] = useState('Un001');
  const [Type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filtereddocuments = documents.filter((document) =>
    document.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      Customer_Id,
      image,
      Type,
    };

    axios
      .post('http://localhost:8070/documents/add', formData)
      .then((response) => {
        setSuccessMessage(response.data.message);
        clearForm();
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage(error.message);
      });
  }

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result;
        setImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setCustomer_Id('');
    setType('');
    setImage(null);
  };

  useEffect(() => {
    axios
      .get('http://localhost:8070/documents/')
      .then((res) => {
        setDocuments(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  const handleDelete = (documentId) => {
    axios
      .delete(`http://localhost:8070/documents/delete/${documentId}`)
      .then(() => {
        setDocuments(
          documents.filter((document) => document._id !== documentId)
        );
        alert('Document successfully deleted.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting Document:', error);
      });
  };

  return (
    <>
      <div className="mb-5"></div>
      <div className="flex">
        <div
          className="card p-4 mt-5 shadow-lg mb-5 bg-white rounded"
          style={{
            marginLeft: '300px',
            marginTop: '70px',
            width: '550px',
          }}
        >
          <h2 className="my-4">Add Document</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group m-4">
              <label htmlFor="documentType">Document Type :</label>
              <select
                id="documentType"
                name="documentType"
                className="form-control"
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Document Type</option>
                <option value="NIC">NIC (National Identity Card)</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Passport">Passport</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="form-group m-4">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                className="form-control-file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <div className="m-4">
              <img
                className=""
                width={200}
                height={200}
                src={image}
                alt="Document"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </form>
          {successMessage && (
            <div className="alert alert-success my-3">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger my-3">{errorMessage}</div>
          )}
        </div>
      </div>
      <div style={{ marginLeft: '100px', width: '500px'}}>
        <div className="input-group">
          <input
            style={{ width: '200px'}}
            type="search"
            id="form1"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by Item Name...'
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginLeft: '10px' }}
          >
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </div>
      <div
        className="card p-3 mt-1 shadow-lg mb-5 bg-white rounded"
        style={{
          marginLeft: '50px',
          marginTop: '20px',
          width: '1100px',
        }}
      >
        <table id="document-table" className="table table-striped p-5 fs-5">
          <thead>
            <tr>
              <th className="px-6 py-3" scope="col">
                Document
              </th>
              <th className="px-6 py-3" scope="col">
                Document Type
              </th>
              <th className="px-6 py-3" scope="col">
                Last Update
              </th>

              <th className="px-6 py-3" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtereddocuments.map((document) => (
              <tr key={document._id}>
                <td className="px-6 py-3">
                  <img
                    src={document.image}
                    alt={document.Type}
                    style={{ width: '90px', height: '80px' }}
                  />
                </td>

                <td className="px-6 py-3">{document.Type}</td>
                <td className="px-6 py-3">{document.Date}</td>

                <td className="px-6 py-3">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(document._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/edit/${document._id}`}>
                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: '10px' }}
                    >
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddDocument;
