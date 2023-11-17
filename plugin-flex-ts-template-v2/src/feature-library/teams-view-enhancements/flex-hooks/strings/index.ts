// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
<<<<<<< HEAD
=======
  TeamsViewColumnActivity = 'PSTeamsViewColumnActivity',
>>>>>>> upstream/main
  TeamsViewColumnTeamName = 'PSTeamsViewColumnTeamName',
  TeamsViewColumnDepartment = 'PSTeamsViewColumnDepartment',
  TeamsViewColumnLocation = 'PSTeamsViewColumnLocation',
  TeamsViewColumnSkills = 'PSTeamsViewColumnSkills',
}

export const stringHook = () => ({
  'en-US': {
<<<<<<< HEAD
=======
    [StringTemplates.TeamsViewColumnActivity]: 'Activity',
>>>>>>> upstream/main
    [StringTemplates.TeamsViewColumnTeamName]: 'Team Name',
    [StringTemplates.TeamsViewColumnDepartment]: 'Department',
    [StringTemplates.TeamsViewColumnLocation]: 'Location',
    [StringTemplates.TeamsViewColumnSkills]: 'Skills',
  },
  'es-MX': {
<<<<<<< HEAD
=======
    [StringTemplates.TeamsViewColumnActivity]: 'Actividad',
>>>>>>> upstream/main
    [StringTemplates.TeamsViewColumnTeamName]: 'Equipo',
    [StringTemplates.TeamsViewColumnDepartment]: 'Departamento',
    [StringTemplates.TeamsViewColumnLocation]: 'Lugar',
    [StringTemplates.TeamsViewColumnSkills]: 'Habilidades',
  },
});
