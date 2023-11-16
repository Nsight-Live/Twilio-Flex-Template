const axios = require('axios');
// Load the mappings once if they are static, this needs to be outside of your handler
// If the mappings can change frequently, this approach must be modified
let mappingsCache = null;

async function getMappings() {
  console.log('Trying to get the mappings');
  if (!mappingsCache) {
    const response = await axios.get('https://nsight-build-work-4650.twil.io/mappings.json');
    mappingsCache = response.data;
  }
  return mappingsCache;
}

async function findMappingForNumber(toNumber) {
  console.log('Trying to find the numbers');
  const mappings = await getMappings();
  const mapping = mappings.find((m) => m.phoneNumber === toNumber);
  return (
    mapping || {
      queueName: 'General',
      dealerName: 'General',
      friendlyName: 'General',
    }
  );
}

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();

  // Create a Twilio Response object
  const twilioResponse = new Twilio.Response();

  // Set the headers to allow CORS since we're returning this to Studio
  twilioResponse.appendHeader('Access-Control-Allow-Origin', '*');
  twilioResponse.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  twilioResponse.appendHeader('Content-Type', 'application/json');

  console.log('here is the event', event);
  console.log('here is the context', client);
  console.log('Here is the conversationSid', event.conversationSid);
  console.log('Here is the participantSid', event.participantSid);

  let toNumber;

  try {
    if (event.conversationSid && event.participantSid) {
      const participant = await client.conversations.v1
        .conversations(event.conversationSid)
        .participants(event.participantSid)
        .fetch();
      // console.log('Participant data:', participant.messagingBinding);
      toNumber = participant.messagingBinding.proxy_address;
    } else if (event.phone) {
      toNumber = event.phone; // Default to event.phone if it's a voice call
    } else if (!toNumber) {
      throw new Error('No phone number found for the mapping process.');
    }

    console.log('Here is the toNumber', toNumber);
    const mapping = await findMappingForNumber(toNumber);
    console.log('Here is the mapping that was found', mapping);
    twilioResponse.setBody(mapping);
  } catch (error) {
    console.error('Error occurred:', error);
    twilioResponse.setBody({ error: error.message || 'An error occurred while processing the request.' });
    twilioResponse.setStatusCode(500);
  }

  callback(null, twilioResponse);
};
