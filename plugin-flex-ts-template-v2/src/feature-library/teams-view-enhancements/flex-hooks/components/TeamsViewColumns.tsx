import React from 'react';
import * as Flex from '@twilio/flex-ui';

<<<<<<< HEAD
import { Worker } from '../../../../types/task-router';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';
import {
=======
import { CustomWorkerAttributes } from '../../../../types/task-router/Worker';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';
import {
  isCallsColumnEnabled,
  isOtherTasksColumnEnabled,
>>>>>>> upstream/main
  isTeamColumnEnabled,
  isDepartmentColumnEnabled,
  isLocationColumnEnabled,
  isAgentSkillsColumnEnabled,
<<<<<<< HEAD
} from '../../config';

interface WorkerItem {
  worker: Worker;
}

=======
  isActivityIconEnabled,
  getAgentActivityConfig,
} from '../../config';
import AgentActivityIcon from './AgentActivityIcon/AgentActivityIcon';

interface WorkerItem {
  worker: {
    attributes: CustomWorkerAttributes;
    activityName: string;
  };
}
const activityConfig = getAgentActivityConfig();
>>>>>>> upstream/main
const getSkills = (item: WorkerItem) => {
  return item.worker.attributes.routing ? item.worker?.attributes?.routing?.skills?.join(', ') : '-';
};

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addWorkersDataTableColumns(flex: typeof Flex, manager: Flex.Manager) {
<<<<<<< HEAD
=======
  if (!isCallsColumnEnabled()) flex.WorkersDataTable.Content.remove('calls');
  if (!isOtherTasksColumnEnabled()) flex.WorkersDataTable.Content.remove('tasks');

  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      style={{ width: 70 }}
      key="Activity"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnActivity]}
      content={(item: WorkerItem) => (
        <AgentActivityIcon activityName={item.worker.activityName} activityConfig={activityConfig} />
      )}
    />,
    { sortOrder: 0, if: () => isActivityIconEnabled() },
  );
>>>>>>> upstream/main
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="team"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnTeamName]}
      content={(item: WorkerItem) => item.worker.attributes.team_name}
    />,
    { sortOrder: 4, if: () => isTeamColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="department"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnDepartment]}
      content={(item: WorkerItem) => item.worker.attributes.department_name}
    />,
    { sortOrder: 5, if: () => isDepartmentColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="location"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnLocation]}
      content={(item: WorkerItem) => item.worker.attributes.location}
    />,
    { sortOrder: 6, if: () => isLocationColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="skills"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnSkills]}
      content={(item: WorkerItem) => getSkills(item)}
    />,
    { sortOrder: 7, if: () => isAgentSkillsColumnEnabled() },
  );
};
