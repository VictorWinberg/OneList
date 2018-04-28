import {
  ADD_COLLABORATOR,
  TOGGLE_COLLABORATOR,
  REMOVE_COLLABORATOR,
  REMOVE_COLLABORATORS,
} from '../constants/collaborators';

let collaboratorIndex = 0;

const collaborators = (state = [], action) => {
  switch (action.type) {
    case ADD_COLLABORATOR:
      if (!action.text) return state;
      collaboratorIndex += 1;
      return [
        ...state,
        {
          id: collaboratorIndex,
          text: action.text,
          pending: true,
        },
      ];
    case TOGGLE_COLLABORATOR: {
      const toggled = state.filter(
        collaborator => collaborator.id === action.id
      )[0];
      return [
        ...state.filter(collaborator => collaborator.id !== action.id),
        {
          ...toggled,
          pending: !toggled.pending,
        },
      ];
    }
    case REMOVE_COLLABORATOR:
      return state.filter(collaborator => collaborator.id !== action.id);
    case REMOVE_COLLABORATORS:
      return state.filter(collaborator => !collaborator.pending);
    default:
      return state;
  }
};

export default collaborators;
