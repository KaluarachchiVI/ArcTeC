import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackCard from './FeedbackCard';
import { Box, Container, Text } from '@chakra-ui/react';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/feedback/")
      .then((res) => {
        setFeedback(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log("Error while getting data");
      });
  }, []);

  const renderFeedback = feedback.length === 0 ? (
    <Text>No feedbacks found!</Text>
  ) : (
    feedback.map((feedbackItem, index) => (
      <FeedbackCard key={index} feedback={feedbackItem} />
    ))
  );

  return (
    <Box className="showFeedbackList">
      <Container maxW="container.xl">
        <Box className="list">
          {renderFeedback}
        </Box>
      </Container>
    </Box>
  );
};

export default FeedbackList;
