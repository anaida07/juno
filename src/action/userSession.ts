import axios from 'axios';
import { configs } from '../config'

export const fetchProfile = () =>
  (dispatch: any) =>
    axios.get(configs.HUB_SERVICE_URL + 'worker/' + localStorage.getItem('userId'), {
      headers: {
        'Authorization': localStorage.getItem('auth'),
      }
    })
    .then((response) => {
      dispatch({
        type: 'FETCH_PROFILE',
        payload: response.data
      });
    })
    .catch((error) => {
      console.log(error);
    });

export const fetchTasks = () =>
  (dispatch: any) =>
    axios.get(configs.HUB_SERVICE_URL + 'worker/' + localStorage.getItem('userId')+ '/tasks', {
      headers: {
        'Authorization': localStorage.getItem('auth'),
      }
    })
    .then((response) => {
      dispatch({
        type: 'FETCH_TASKS',
        payload: response.data
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: 'FETCH_TASKS_ON_ERROR',
      })
    });

export const switchWorkMode = (val: boolean) =>
  ({
    type: 'SWITCH_WORK_MODE',
    payload: val,
  });

export const switchActiveTab = (val: string) =>
({
  type: 'SWITCH_ACTIVE_TAB',
  payload: val,
});

export const updateTaskUrls = (val: object) =>
({
  type: 'UPDATE_TASK_URLS',
  payload: val,
});

export const updateTaskTitles = (val: []) =>
({
  type: 'UPDATE_TASK_TITLES',
  payload: val,
});
