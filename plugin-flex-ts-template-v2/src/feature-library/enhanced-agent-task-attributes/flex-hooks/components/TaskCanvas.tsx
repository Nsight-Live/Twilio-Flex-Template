import * as Flex from '@twilio/flex-ui';

import EnhancedAgentTaskDetails from '../../custom-components/EnhancedAgentTaskDetails';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvas;
export const componentHook = function addAutoWrap(flex: typeof Flex) {
  flex.TaskCanvas.Content.add(<EnhancedAgentTaskDetails key="enhanced-agent-task-details" />, {
    sortOrder: -1,
  });
};
