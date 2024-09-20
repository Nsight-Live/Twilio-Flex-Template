const VoiceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-voice"
].path);
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const CallbackOperations = require(Runtime.getFunctions()[
  "features/callback-and-voicemail/common/callback-operations"
].path);

const options = {
  sayOptions: { voice: "Polly.Joanna" },
  messages: {
    initialGreeting: "Please wait while we prepare to take your message.",
    recordVoicemailPrompt:
      "Please leave a message at the tone. When you are finished recording, you may hang up, or press the star key.",
    voicemailNotCaptured: "Sorry. We weren't able to capture your message.",
    voicemailRecorded:
      "Your voicemail has been successfully recorded... Goodbye",
    processingError:
      "Sorry, we were unable to process your request. Please try again later.",
  },
};

async function getPendingTaskByCallSid(context, callSid, workflowSid) {
  console.log(
    `Searching for task with CallSid: ${callSid} in workflow: ${workflowSid}`
  );
  const result = await TaskRouterOperations.getTasks({
    context,
    assignmentStatus: ["pending", "reserved"],
    workflowSid,
    ordering: "DateCreated:desc",
    limit: 50,
  });
  console.log(`Found ${result.tasks.length} tasks`);
  const task = result.tasks?.find(
    (task) => task.attributes.call_sid === callSid
  );
  console.log(
    task ? `Matching task found: ${task.sid}` : "No matching task found"
  );
  return task;
}

async function fetchTask(context, taskSid) {
  console.log(`Fetching task: ${taskSid}`);
  const result = await TaskRouterOperations.fetchTask({
    context,
    taskSid,
  });
  return result.task;
}

async function cancelTask(context, task, cancelReason) {
  console.log(`Cancelling task: ${task.sid} with reason: ${cancelReason}`);
  const newAttributes = {
    ...task.attributes,
    conversations: {
      ...task.attributes.conversations,
      abandoned: "Follow-Up",
    },
  };

  return TaskRouterOperations.updateTask({
    context,
    taskSid: task.sid,
    updateParams: {
      assignmentStatus: "canceled",
      reason: cancelReason,
      attributes: JSON.stringify(newAttributes),
    },
  });
}

async function handleVoicemailSelected(context, callSid, taskSid) {
  console.log(
    `Handling voicemail for CallSid: ${callSid}, TaskSid: ${taskSid}`
  );
  const twiml = new Twilio.twiml.VoiceResponse();
  const domain = `https://${context.DOMAIN_NAME}`;

  const cancelReason = "Redirected to voicemail";
  const mode = "record-voicemail";

  const task = await fetchTask(context, taskSid);

  const result = await VoiceOperations.updateCall({
    context,
    callSid,
    params: {
      method: "POST",
      url: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=${mode}&CallSid=${callSid}&enqueuedTaskSid=${taskSid}`,
    },
  });
  const { success, status } = result;

  if (success) {
    await cancelTask(context, task, cancelReason);
    console.log(`Successfully redirected call ${callSid} to voicemail`);
  } else {
    console.error(
      `Failed to update call ${callSid} with new TwiML. Status: ${status}`
    );
    twiml.say(options.sayOptions, options.messages.processingError);
    twiml.redirect(
      `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=record-voicemail&CallSid=${callSid}&enqueuedTaskSid=${taskSid}`
    );
    return twiml;
  }
  return "";
}

exports.handler = async (context, event, callback) => {
  console.log("Function invoked with event:", JSON.stringify(event));
  const twiml = new Twilio.twiml.VoiceResponse();
  const domain = `https://${context.DOMAIN_NAME}`;

  const { CallSid, QueueSid, mode, enqueuedTaskSid } = event;

  console.log(
    `Extracted parameters - CallSid: ${CallSid}, QueueSid: ${QueueSid}, mode: ${mode}, enqueuedTaskSid: ${enqueuedTaskSid}`
  );

  // If no mode is specified, default to 'initialize'
  const currentMode = mode || "initialize";
  console.log(`Processing mode: ${currentMode}`);

  try {
    switch (currentMode) {
      case "initialize":
        console.log("Entering initialize mode");
        if (!QueueSid) {
          console.error(
            "QueueSid is missing. Cannot proceed with task lookup."
          );
          throw new Error("QueueSid is required");
        }
        const queueResult = await VoiceOperations.fetchVoiceQueue({
          context,
          queueSid: QueueSid,
        });
        const enqueuedWorkflowSid = queueResult.queueProperties.friendlyName;
        console.log(`Enqueued workflow sid: ${enqueuedWorkflowSid}`);
        const enqueuedTask = await getPendingTaskByCallSid(
          context,
          CallSid,
          enqueuedWorkflowSid
        );

        if (enqueuedTask) {
          console.log(`Task found, proceeding to handle voicemail`);
          return callback(
            null,
            await handleVoicemailSelected(context, CallSid, enqueuedTask.sid)
          );
        } else {
          console.error(`No pending task found for CallSid: ${CallSid}`);
          twiml.say(options.sayOptions, options.messages.processingError);
          twiml.hangup();
          return callback(null, twiml);
        }

      case "record-voicemail":
        console.log(`Recording voicemail for CallSid: ${CallSid}`);
        twiml.say(options.sayOptions, options.messages.recordVoicemailPrompt);
        twiml.record({
          action: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=voicemail-recorded&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
          transcribeCallback: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=submit-voicemail&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
          method: "GET",
          playBeep: "true",
          transcribe: true,
          timeout: 10,
          finishOnKey: "*",
        });
        return callback(null, twiml);

      case "voicemail-recorded":
        console.log(`Voicemail recorded for CallSid: ${CallSid}`);
        twiml.say(options.sayOptions, options.messages.voicemailRecorded);
        twiml.hangup();
        return callback(null, twiml);

      case "submit-voicemail":
        console.log(`Submitting voicemail for CallSid: ${CallSid}`);
        await CallbackOperations.createCallbackTask({
          context,
          numberToCall: event.Caller,
          numberToCallFrom: event.Called,
          recordingSid: event.RecordingSid,
          recordingUrl: event.RecordingUrl,
          transcriptSid: event.TranscriptionSid,
          transcriptText: event.TranscriptionText,
        });
        return callback(null, "");

      default:
        console.error(`Unknown mode: ${currentMode}`);
        twiml.say(options.sayOptions, options.messages.processingError);
        twiml.hangup();
        return callback(null, twiml);
    }
  } catch (error) {
    console.error(`Unexpected error in handler: ${error}`);
    twiml.say(options.sayOptions, options.messages.processingError);
    twiml.hangup();
    return callback(null, twiml);
  }
};
