import React, { useState } from 'react';
import { Box, Text, Button, Flex, VStack} from '@chakra-ui/react';
import './FeedbackCard.css'; // Import CSS file

const FeedbackCard = ({ feedback, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFeedback, setUpdatedFeedback] = useState({ ...feedback });

  const handleUpdate = () => {
    // Implement update logic
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(); // Trigger parent component's onDelete function
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedFeedback({ ...feedback }); // Reset to original feedback
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFeedback({ ...updatedFeedback, [name]: value });
  };

  if (!updatedFeedback) {
    return null; // If feedback is deleted (null), don't render the card
  }

  return (
    <div>
      {isEditing ? (
        <div className="form-container">
          <form>
            <label>
              Client Name:
              <input
                type="text"
                name="clientName"
                value={updatedFeedback.clientName}
                onChange={handleChange}
              />
            </label>
            <label>
              Client Email:
              <input
                type="email"
                name="clientEmail"
                value={updatedFeedback.clientEmail}
                onChange={handleChange}
              />
            </label>
            <label>
              Role (Client, Architect, Admin):
              <input
                type="text"
                name="role"
                value={updatedFeedback.role}
                onChange={handleChange}
              />
            </label>
            <label>
              Feedback:
              <textarea
                name="context"
                value={updatedFeedback.context}
                onChange={handleChange}
              />
            </label>
            <label>
              Rate:
              <input
                type="text"
                name="type"
                value={updatedFeedback.type}
                onChange={handleChange}
              />
            </label>
            <button type="button" onClick={handleUpdate}>Save</button>
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white" // Set the background color to white
      m={4} // Add margin around the card for spacing
      overflow="hidden"
    >
      <VStack align="stretch" spacing={3}>
        <Text><strong>Client ID:</strong> {feedback.clientID}</Text>
        <Text><strong>Client Name:</strong> {feedback.clientName}</Text>
        <Text><strong>Client Email:</strong> {feedback.clientEmail}</Text>
        <Text><strong>Role:</strong> {feedback.role}</Text>
        <Flex>
          <Text flex="1"><strong>Feedback:</strong></Text>
          <Text flex="5">
            {feedback.context.split("").map((char, index) =>
              index === 0 ? char : (char === ' ' ? char + "\n" : char)
            ).join("")}
          </Text>
        </Flex>
        <Text><strong>Rate:</strong> {feedback.type}</Text>
        <Text><strong>Date and Time:</strong> {feedback.dateandtime}</Text>
      </VStack>
      <Flex mt={4}>
        <Button colorScheme="blue" mr={3}>Update</Button>
        <Button colorScheme="red">Delete</Button>
      </Flex>
    </Box>
      )}
    </div>
  );
};

export default FeedbackCard;