import {
  ADD_COLLABORATOR,
  TOGGLE_COLLABORATOR,
  REMOVE_COLLABORATOR,
  REMOVE_COLLABORATORS,
} from '../constants/collaborators';

export const addCollaborator = text => ({
  type: ADD_COLLABORATOR,
  text,
});

export const toggleCollaborator = id => ({
  type: TOGGLE_COLLABORATOR,
  id,
});

export const removeCollaborator = id => ({
  type: REMOVE_COLLABORATOR,
  id,
});

export const removeCollaborators = () => ({
  type: REMOVE_COLLABORATORS,
});
