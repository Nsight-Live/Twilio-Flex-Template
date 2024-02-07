import { getFeatureFlags } from '../../utils/configuration';
import EnhancedAgentTaskAttributesConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.enhanced_agent_task_attributes as EnhancedAgentTaskAttributesConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
