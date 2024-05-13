import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        // Display success message
        alert('Document successfully deleted.');
        // Refresh the page
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting Documents:', error);
        // Handle error state or display a message to the user
      });
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'document_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtereddocuments = documents.filter((document) =>
    document.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    html2canvas(document.querySelector('#document-table')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgHeight = (canvas.height * 208) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
      pdf.save('orders_report.pdf');
    });
  };

  return (
    <div>
      <div>
        <div className="mb-5"></div>
        <div className="d-flex">
          <div className="" style={{ marginTop: '-50px' }}></div>
          <div>
            <div className="mb-5" style={{ marginLeft: '100px' }}>
              <h1>Admin Dashboard</h1>
            </div>

            <div className="d-flex " style={{ marginLeft: '250px' }}>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </button>
              </div>
              <div style={{ marginLeft: '350px' }}>
                <div className="input-group">
                  <input
                    style={{ width: '300px' }}
                    type="search"
                    id="form1"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Item Name..."
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
            </div>

            <div
              className="card p-3 mt-1 shadow-lg mb-5 bg-white rounded"
              style={{
                marginLeft: '50px',
                marginTop: '20px',
                width: '1100px',
              }}
            >
              <table
                id="document-table"
                className="table table-striped p-5 fs-5"
              >
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

                      <td className="px-6 py-3 space-x-2">
                        <button
                          className="btn btn-danger inline-block px-4 py-2 leading-none border rounded text-white bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(document._id)}
                        >
                          Delete
                        </button>
                        <Link to={`/adminEdit/${document._id}`}>
                          <button className="m-2 btn btn-primary inline-block px-4 py-2 leading-none border rounded text-white bg-blue-600 hover:bg-blue-700">
                            Edit
                          </button>
                        </Link>
                        <button
                          className="m-2 btn btn-primary inline-block px-4 py-2 leading-none border rounded text-white bg-green-600 hover:bg-green-700"
                          onClick={() => handleDownload(document.image)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
