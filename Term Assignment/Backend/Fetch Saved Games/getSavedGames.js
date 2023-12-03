const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userEmail = event.queryStringParameters.email;

  const params = {
    TableName: "Users",
    Key: {
      email: userEmail,
    },
    ProjectionExpression: "saved_matches",
  };

  try {
    const data = await dynamoDB.get(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
      body: JSON.stringify({ error: "Could not fetch saved matches" }),
    };
  }
};
