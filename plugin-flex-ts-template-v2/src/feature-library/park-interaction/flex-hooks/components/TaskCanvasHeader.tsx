import * as Flex from '@twilio/flex-ui';

import ParkButton from '../../custom-components/ParkButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addParkButton(flex: typeof Flex) {
  // This also removes end task for all types, may need to add this back later after testing
  flex.TaskCanvasHeader.Content.remove('actions');
  flex.TaskCanvasHeader.Content.add(<ParkButton key="park-button" />, {
    sortOrder: 1,
    if: (props) => Flex.TaskHelper.isCBMTask(props.task) && props.task.taskStatus === 'assigned',
  });
};
