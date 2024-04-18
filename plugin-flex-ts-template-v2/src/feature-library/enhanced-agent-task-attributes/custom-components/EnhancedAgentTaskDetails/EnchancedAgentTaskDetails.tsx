import * as React from 'react';
import { useEffect, useState } from 'react';
import { ITask } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Text } from '@twilio-paste/core/text';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { AcceptIcon } from '@twilio-paste/icons/esm/AcceptIcon';

type EnhancedAgentTaskDetailsProps = {
  task: ITask;
};

const EnhancedAgentTaskDetails = ({ task }: EnhancedAgentTaskDetailsProps) => {
  const [dealerName, setDealerName] = useState(task.attributes.dealerName || ''); // default empty string
  const [editMode, setEditMode] = useState(false); // editMode state

  const handleSubmit = (e: any) => {
    e.preventDefault(); // to prevent page refresh when the form is submitted
    task.setAttributes({ ...task.attributes, dealerName }); // update task attributes
    setEditMode(false); // switch off edit mode
  };

  useEffect(() => {
    // This function will be called anytime the task prop changes
    setDealerName(task.attributes.dealerName || '');
  }, [task]);

  return (
    <Flex hAlignContent="center" vertical>
      {/* Wrap Dealer name and Edit button in another Flex component */}
      <Flex hAlignContent="between">
        <Text
          as="p"
          fontWeight="fontWeightMedium"
          fontSize="fontSize30"
          marginTop="space20"
          marginBottom="space20"
          paddingRight="space20"
          color="colorTextSuccess"
        >
          Dealer Name: {dealerName || 'Unknown'}
        </Text>
        <Button variant="primary_icon" size="reset" onClick={() => setEditMode(true)}>
          <EditIcon decorative={false} title="Edit" />
        </Button>
      </Flex>
      {editMode && (
        <form onSubmit={handleSubmit}>
          <Flex hAlignContent="between" marginBottom="space20">
            <Input id="dealerName" type="text" value={dealerName} onChange={(e) => setDealerName(e.target.value)} />
            <Button variant="primary" type="submit">
              <AcceptIcon decorative={false} title="Accept" />
            </Button>
          </Flex>
        </form>
      )}
    </Flex>
  );
};
export default EnhancedAgentTaskDetails;
