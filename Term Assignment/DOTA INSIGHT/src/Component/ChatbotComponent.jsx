import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

function ChatbotComponent() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  // send user input and handle lex response
  async function sendToLambda(userInput) {
    console.log(JSON.stringify({ userInput }));
    const apiUrl =
      "https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/Lex/integration";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.responseTexts;
    } catch (error) {
      console.error("Error sending message to Lambda:", error);
      return "Sorry, I couldn't understand that.";
    }
  }

  // handle sending messages by the user
  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const newMessages = [
        ...messages,
        { type: "user", content: userInput.trim() },
      ];

      setMessages(newMessages);
      setUserInput("");

      try {
        const botResponse = await sendToLambda(userInput.trim());
        console.log(botResponse);
        const messageArray = botResponse.split("~"); // Split the response by the delimiter

        messageArray.forEach((text) => {
          if (text.trim()) {
            // Avoid adding empty messages
            setMessages((prevMessages) => [
              ...prevMessages,
              { type: "bot", content: text.trim() },
            ]);
          }
        });
      } catch (error) {
        console.error("Error handling the message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: "Sorry, I couldn't understand that." },
        ]);
      }
    }
  };

  return (
    <>
      <Box position="fixed" bottom="4" right="4">
        <Button
          bgColor="black"
          leftIcon={<AddIcon />}
          color="white"
          _hover={{ bgColor: "gray.700" }}
          onClick={onToggle}
        >
          Chat with Dota Bot
        </Button>
      </Box>
      {isOpen && (
        <Box
          position="fixed"
          bottom="16"
          right="4"
          maxW="96"
          bg="gray.800"
          shadow="md"
          rounded="lg"
        >
          <Box
            p="4"
            borderBottom="1px"
            borderColor="gray.700"
            bgColor="black"
            color="red"
            roundedTop="lg"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="lg" fontWeight="semibold">
              DOTA Bot
            </Text>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close chat"
              variant="unstyled"
              color="gray.300"
              _hover={{ color: "gray.500" }}
              onClick={onToggle}
            />
          </Box>
          <VStack p="4" h="80" overflowY="auto" spacing="2">
            {messages.map((message, index) => (
              <Box
                key={index}
                w="100%"
                display="flex"
                justifyContent={
                  message.type === "user" ? "flex-end" : "flex-start"
                }
              >
                <Box
                  display="inline-block"
                  bg={message.type === "user" ? "black" : "gray.700"}
                  color="white"
                  p="2"
                  rounded="lg"
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </VStack>
          <Box p="4" borderTop="1px" borderColor="gray.700" display="flex">
            <Input
              flex="1"
              placeholder="Type a message"
              value={userInput}
              color="white"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button
              ml="2"
              bgColor="black"
              color="white"
              _hover={{ bgColor: "gray.700" }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
export default ChatbotComponent;
