const https = require("https");

exports.handler = async (event) => {
  const match_id = event.sessionState.intent.slots.match_id.value.originalValue;
  console.log(event);
  console.log(event.sessionState.intent.slots);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "y3gdfwezvd.execute-api.us-east-1.amazonaws.com",
      path: `/dev/matches/${match_id}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(responseBody);
            const outcome = data.result.matchOutcome;
            resolve(buildResponse(event, `Match outcome: ${outcome}`));
          } catch (error) {
            console.error("JSON parsing error:", error);
            reject(buildErrorResponse("Error parsing match details."));
          }
        } else {
          console.error(`HTTP error! status: ${res.statusCode}`);
          reject(buildErrorResponse("Failed to fetch match data."));
        }
      });
    });

    req.on("error", (error) => {
      console.error("Error making HTTPS request:", error);
      reject(buildErrorResponse("Error making HTTPS request."));
    });

    req.end();
  });
};

function buildResponse(event, messageContent) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: event.sessionState.intent.name,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: messageContent,
      },
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
}

function buildErrorResponse(message) {
  return {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
    body: JSON.stringify({ error: message }),
  };
}
