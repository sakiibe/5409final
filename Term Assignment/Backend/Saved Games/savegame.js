const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { email, matchId } = JSON.parse(event.body);

  const params = {
    TableName: "Users",
    Key: { email },
    UpdateExpression:
      "SET saved_matches = list_append(saved_matches, :matchId)",
    ExpressionAttributeValues: {
      ":matchId": [matchId],
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        message: "Match saved successfully",
        result: result,
      }),
    };
  } catch (error) {
    console.error("Error saving match:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({ error: "Could not save match" }),
    };
  }
};
