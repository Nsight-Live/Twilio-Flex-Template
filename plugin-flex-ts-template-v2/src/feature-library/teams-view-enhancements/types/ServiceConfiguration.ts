export default interface TeamsViewEnhancementsConfig {
  enabled: boolean;
  highlight_handle_time: boolean;
  handle_time_warning_threshold: number;
  handle_time_exceeded_threshold: number;
  display_task_queue_name: boolean;
  columns: {
<<<<<<< HEAD
=======
    calls: boolean;
    other_tasks: boolean;
>>>>>>> upstream/main
    team: boolean;
    department: boolean;
    location: boolean;
    agent_skills: boolean;
    capacity: boolean;
<<<<<<< HEAD
=======
    activity_icon: boolean;
>>>>>>> upstream/main
  };
}
