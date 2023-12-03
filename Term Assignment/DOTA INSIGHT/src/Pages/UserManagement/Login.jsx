import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Input, Button, FormControl, Text } from "@chakra-ui/react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const loginApiUrl =
      "https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/login";

    const requestBody = JSON.stringify({ email, password });

    fetch(loginApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        localStorage.setItem("userEmail", email);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
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
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          marginBottom="4"
          required
        />
        <Flex alignItems="center" justifyContent="space-between">
          <Button type="submit" marginTop="4">
            Sign In
          </Button>
          <Text
            marginTop="4"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/signup")}
          >
            Don't have an account?
          </Text>
        </Flex>
      </FormControl>
    </Flex>
  );
}

export default Login;
