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
    text: 'First User',
    pending: true,
  },
];

describe('collaborators reducer', () => {
  it('has a default state', () => {
    expect(collaborators(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_COLLABORATOR', () => {
    expect(collaborators(undefined, addCollaborator('First User'))).toEqual(
      testCollaborator
    );
  });

  it('can handle ADD_COLLABORATOR for None', () => {
    expect(collaborators(undefined, addCollaborator(''))).toEqual([]);
  });

  it('can handle TOGGLE_COLLABORATOR', () => {
    expect(collaborators(testCollaborator, toggleCollaborator(1))).toEqual(
      testCollaborator.map(product => ({ ...product, pending: false }))
    );
  });

  it('can handle REMOVE_CATEGORY', () => {
    expect(
      collaborators(
        [...testCollaborator, { id: 2, text: 'Second User' }],
        removeCollaborator(1)
      )
    ).toEqual([{ id: 2, text: 'Second User' }]);
  });

  it('can handle REMOVE_COLLABORATORS', () => {
    expect(
      collaborators(
        [
          ...testCollaborator,
          { id: 2, text: 'Second User', pending: true },
          { id: 3, text: 'Third User', pending: false },
        ],
        removeCollaborators()
      )
    ).toEqual([{ id: 3, text: 'Third User', pending: false }]);
  });
});
