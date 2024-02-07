import * as React from 'react';
import { ITask } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Text } from '@twilio-paste/core/text';

type EnhancedAgentTaskDetailsProps = {
  task: ITask;
};

const EnhancedAgentTaskDetails = ({ task }: EnhancedAgentTaskDetailsProps) => {
  return (
    <Flex hAlignContent="center" vertical>
      <Text
        as="p"
        textAlign="center"
        fontWeight="fontWeightMedium"
        fontSize="fontSize30"
        marginTop="space20"
        marginBottom="space20"
        color="colorTextSuccess"
      >
        Dealer Name: {task.attributes.dealerName}
      </Text>
    </Flex>
  );
};

export default EnhancedAgentTaskDetails;
