import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Input, Button, FormControl } from "@chakra-ui/react";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [playerID, setPlayerID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/signup",
        {
          email,
          password,
          player_id: playerID,
        }
      );
      console.log(response.data); // Handle response as needed
      navigate("/");
    } catch (error) {
      console.error(
        "Signup error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  return (
    <Flex
      width="100%"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <FormControl
        as="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth="360px"
        padding="8"
      >
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          marginBottom="4"
          required
        />
        <Input
          placeholder="Player Id"
          type="number"
          value={playerID}
          onChange={(e) => setPlayerID(e.target.value)}
          marginBottom="4"
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          marginBottom="4"
          required
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          marginBottom="4"
          required
        />
        <Button type="submit" marginTop="4">
          Sign Up
        </Button>
      </FormControl>
    </Flex>
  );
}

export default Signup;
