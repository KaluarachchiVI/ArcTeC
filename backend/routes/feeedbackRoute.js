const express = require('express');
const router = express.Router();
const feedbacks = require("../models/feedback");


router.get("/test", (req, res) => res.send("Feedback routes working"));

router.post("/", (req, res) => {
    feedbacks.create(req.body)
      .then(() => res.json({ msg: "Feedbacks added successfully" }))
      .catch(err => {
          console.error("Error adding feedback:", err); // Log the error for debugging purposes
          res.status(500).json({ msg: "Failed to add feedback. Please try again later." }); // Send a generic error message
      });
});


router.get("/", (req, res)=> {
    feedbacks.find()
    .then((feedback)=> res.json(feedback))
    .catch((err)=> res.status(400).json({msg:"No feedbacks found"}));
});


router.put("/:id", (req, res)=> {
    feedbacks.findByIdAndUpdate(req.params.id, req.body)
    .then(()=> res.json({msg: "Feedback updated successfully"}))
    .catch(()=> res.status(400).json({msg: "Feedback updating failed"}));
}); 

router.delete("/:id", (req, res)=> {
    feedbacks.findByIdAndDelete(req.params.id)
    .then(()=> res.json({msg: "Feedback deleted successfully"}))
    .catch(()=> res.status(400).json({msg: "Feedback deleting failed"}));
});
module.exports = router;

