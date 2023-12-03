const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { email, password, player_id } = JSON.parse(event.body);

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Prepare the DynamoDB put parameters
  const params = {
    TableName: "Users",
    Item: {
      email: email,
      password: hashedPassword,
      player_id: player_id,
      saved_matches: [],
    },
    ConditionExpression: "attribute_not_exists(email)", // Ensure email is unique
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      // if user exists
      return {
        statusCode: 409,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        body: JSON.stringify({ error: "User already exists" }),
      };
    }

    console.error(
      "Unable to create user. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({ error: "Could not create user" }),
    };
  }
};
