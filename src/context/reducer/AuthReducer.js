import { ActionTypes } from "../Types";
const AuthReducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case ActionTypes.Auth_SetStatus:
      newState.state = !newState.state;
      return newState;
    case ActionTypes.Auth_SetUserName:
      newState.username = action.payload.data;
      return newState;
    default:
      return state;
  }
};
export default AuthReducer;
