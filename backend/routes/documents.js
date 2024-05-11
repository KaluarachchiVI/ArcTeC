const express = require('express');
const router = express.Router();
const Document = require('../models/document')

// Add a new document
router.post('/add', async (req, res) => {
  try {
    const { Customer_Id, Type, image } = req.body;

    const newDocument = new Document({   
      Customer_Id,
      Type,
      Date: new Date(), 
      image,
    });
    await newDocument.save();
    res.json({
      message: 'Document added successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find(); // Change Customer to Document
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Update a document by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Type, image } = req.body;
    const currentDate = new Date(); // Get the current date and time
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { Type, image, Date: currentDate }, // Include Date field with current date
      { new: true }
    );
    res.json({
      message: 'Document updated successfully',
      document: updatedDocument,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update document' });
  }
});


// Delete a document by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id); // Change Customer to Document
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Get a document by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id); // Change Customer to Document
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

module.exports = router;
