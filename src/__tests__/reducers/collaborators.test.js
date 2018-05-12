import { store } from '../store';
import collaborators from '../../reducers/collaborators';
import {
  addCollaborator,
  toggleCollaborator,
  removeCollaborator,
  removeCollaborators,
} from '../../actions/collaborators';

const testCollaborator = [
  {
    id: 1,
    email: 'First User',
    pending: true,
  },
];

describe('collaborators reducer', () => {
  const { dispatch } = store;
  it('has a default state', () => {
    expect(collaborators(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_COLLABORATOR', () => {
    expect(
      collaborators(
        undefined,
        dispatch(addCollaborator({ email: 'First User' }))
      )
    ).toEqual(testCollaborator);
  });

  it('can handle ADD_COLLABORATOR for None', () => {
    expect(collaborators(undefined, dispatch(addCollaborator({})))).toEqual([]);
  });

  it('can handle TOGGLE_COLLABORATOR', () => {
    expect(
      collaborators(testCollaborator, dispatch(toggleCollaborator(1)))
    ).toEqual(
      testCollaborator.map(product => ({ ...product, pending: false }))
    );
  });

  it('can handle REMOVE_CATEGORY', () => {
    expect(
      collaborators(
        [...testCollaborator, { id: 2, email: 'Second User' }],
        dispatch(removeCollaborator(1))
      )
    ).toEqual([{ id: 2, email: 'Second User' }]);
  });

  it('can handle REMOVE_COLLABORATORS', () => {
    expect(
      collaborators(
        [
          ...testCollaborator,
          { id: 2, email: 'Second User', pending: true },
          { id: 3, email: 'Third User', pending: false },
        ],
        dispatch(removeCollaborators())
      )
    ).toEqual([{ id: 3, email: 'Third User', pending: false }]);
  });
});
