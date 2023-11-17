const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [];

let mappingsCache = null;

async function getMappings() {
  if (!mappingsCache) {
    const openMappingsFile = Runtime.getAssets()['/dealer-name/dealer-name-mapping.json'].open;
    mappingsCache = JSON.parse(openMappingsFile());
    console.log('Here is the mappings found', mappingsCache);
  }
  return mappingsCache;
}

async function findMappingForNumber(toNumber) {
  const mappings = await getMappings();
  return (
    mappings.find((m) => m.phoneNumber === toNumber) || {
      queueName: 'General',
      dealerName: 'General',
      friendlyName: 'General',
    }
  );
}

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  console.log('Execution entered here');
  console.log('Here is the event', event);
  console.log('Here is the event to number', event.phone);
  try {
    let toNumber =
      event.phone ||
      (event.participantSid &&
        (await client.conversations.v1
          .conversations(event.conversationSid)
          .participants(event.participantSid)
          .fetch()
          .then((participant) => participant.messagingBinding.proxy_address)));

    if (!toNumber) {
      throw new Error('No phone number found for the mapping process.');
    }

    const mapping = await findMappingForNumber(toNumber);
    response.setBody({ mapping, ...extractStandardResponse(mapping) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
