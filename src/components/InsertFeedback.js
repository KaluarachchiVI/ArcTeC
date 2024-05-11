import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Textarea, Container, VStack, Text
} from '@chakra-ui/react';import axios from 'axios';

const InsertFeedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    clientID: "",
    clientName: "",
    clientEmail: "",
    role: "",
    context: "",
    type: "",
  });

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/api/feedback", feedbackData).then(() => {
      alert("Your feedback has been submitted!");
      history.push("/feedbackinsert"); // Navigate after submit
    });
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
          Feedback Form
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <VStack spacing={4} align="stretch">
          <FormControl id="clientID">
            <FormLabel>Client ID:</FormLabel>
            <Input type="text" name="clientID" onChange={handleChange} value={feedbackData.clientID} />
          </FormControl>
          <FormControl id="clientName">
            <FormLabel>Name:</FormLabel>
            <Input type="text" name="clientName" onChange={handleChange} value={feedbackData.clientName} />
          </FormControl>
          <FormControl id="clientEmail">
            <FormLabel>Email:</FormLabel>
            <Input type="email" name="clientEmail" onChange={handleChange} value={feedbackData.clientEmail} />
          </FormControl>
          <FormControl id="role">
            <FormLabel>Role:</FormLabel>
            <Input type="text" name="role" onChange={handleChange} value={feedbackData.role} />
          </FormControl>
          <FormControl id="context">
            <FormLabel>Feedback:</FormLabel>
            <Textarea name="context" onChange={handleChange} value={feedbackData.context} />
          </FormControl>
          <FormControl id="type">
            <FormLabel>Rate:</FormLabel>
            <Select name="type" onChange={handleChange} value={feedbackData.type}>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="3.5">3.5</option>
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5">5</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit}>Submit</Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default InsertFeedback;
