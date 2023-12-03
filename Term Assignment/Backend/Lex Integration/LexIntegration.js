const {
  LexRuntimeV2,
  RecognizeTextCommand,
} = require("@aws-sdk/client-lex-runtime-v2");

const lexClient = new LexRuntimeV2({
  region: "us-east-1",
});

async function communicateWithLex(userInput, sessionState) {
  const lexParams = {
    botId: "4MTIJFIXTD",
    botAliasId: "TSTALIASID",
    localeId: "en_US",
    sessionId: "637644997269750",
    text: userInput,
    sessionState: sessionState?.sessionState,
  };

  try {
    const data = await lexClient.send(new RecognizeTextCommand(lexParams));
    console.log(data);
    // Check if Lex responded with messages
    if (data.messages && data.messages.length > 0) {
      // Combine all message contents into a single response
      const responseTexts = data.messages.map((msg) => msg.content).join("~");
      const newSessionState = data.sessionState;

      console.log("Lex responses:", responseTexts);
      return { responseTexts, newSessionState };
    } else {
      console.log("Lex responded with no messages.");
      return {
        responseTexts: "An error occurred.",
        newSessionState: undefined,
      };
    }
  } catch (err) {
    console.error("Error communicating with Lex:", err);
    throw err;
  }
}

exports.handler = async (event) => {
  try {
    const { userInput, sessionState } = JSON.parse(event.body || "{}");

    if (!userInput) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "missing input in request",
        }),
      };
    }

    const { responseTexts, newSessionState } = await communicateWithLex(
      userInput,
      sessionState
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        responseTexts,
        sessionState: JSON.stringify(newSessionState),
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify({ error: "An error occurred." }),
    };
  }
};
// "Access-Control-Allow-Headers": "Content-Type"
