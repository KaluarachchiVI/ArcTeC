const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  Customer_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Type: {
    type: String,
    required: true,
  },
  Date: {
    type: Date, 
    default: Date.now, 
  },
  image: {
    type: Object,
    required: true,
  },
});

const document = mongoose.model('Document', documentSchema);

module.exports = document;
