const user = {
  profile: { email: '', fullname: ''},
  activeTab: 'tab1',
  taskUrls: [],
  credentials: [],
  taskTitles: [],
  workingMode: false,
};

const profileState = (state = user, action: any) => {
  const newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case 'FETCH_PROFILE':
      newState.profile.email = action.payload.email;
      newState.profile.fullname = action.payload.fullname;
      return newState;
    case 'FETCH_TASKS':
      newState.taskUrls = action.payload.tasks.map((task: any) => task.url);
      newState.credentials = action.payload.tasks.map((task: any) => task.credentials);
      newState.taskTitles = action.payload.tasks.map(() => 'New Tab');
      return newState;
    case 'FETCH_TASKS_ON_ERROR':
      newState.taskTitles = ['New Tab'];
      newState.taskUrls = ['https://google.com'];
      newState.credentials = [null];
      return newState;
    case 'SWITCH_WORK_MODE':
      newState.workingMode = action.payload;
      return newState;
    case 'SWITCH_ACTIVE_TAB':
      newState.activeTab = action.payload;
      return newState;
    case 'UPDATE_TASK_URLS':
      newState.taskUrls = action.payload.taskUrls;
      newState.activeTab = action.payload.activeTab ? action.payload.activeTab : newState.activeTab;
      return newState;
    case 'UPDATE_TASK_TITLES':
      newState.taskTitles = action.payload;
      return newState;
    default: {
      return newState;
    }
  }
}

export default profileState;
