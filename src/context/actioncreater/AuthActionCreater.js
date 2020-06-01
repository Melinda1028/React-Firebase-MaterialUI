import { ActionTypes } from "../Types";

export const SetStatus = () => ({
  type: ActionTypes.Auth_SetStatus,
  payload: {}
});
export const SetUserName = data => ({
  type: ActionTypes.Auth_SetUserName,
  payload: {
    data
  }
});
