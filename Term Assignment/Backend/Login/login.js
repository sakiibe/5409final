const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const params = {
    TableName: "Users",
    Key: { email },
  };

  try {
    // Fetch the user from DynamoDB
    const result = await dynamoDB.get(params).promise();
    const user = result.Item;

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        body: JSON.stringify({ error: "User does not exist" }),
      };
    }

    // Compare the provided password with the stored hashed password
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({ message: "Login successful" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
