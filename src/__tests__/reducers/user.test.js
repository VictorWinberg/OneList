import makeStore, { store } from '../store';
import user from '../../reducers/user';
import {
  updateUser,
  logoutUser,
  fetchUser,
  submitUser,
} from '../../actions/user';

const testUser = {
  id: 1,
  username: 'John Doe',
  email: 'johndoe@example.com',
  photo: 'https://johndoe.example.com/profile.png',
  language: 'en',
};

describe('user reducer', () => {
  const { dispatch } = store;
  let mockStore;

  beforeEach(() => {
    mockStore = makeStore();
    fetch.mockResponse(JSON.stringify(testUser));
  });

  it('has a default state', () => {
    expect(user(undefined, { type: 'unexpected' })).toEqual({
      isFetching: false,
      isSubmitting: false,
    });
  });

  it('can handle UPDATE_USER', () => {
    const action = dispatch(
      updateUser({
        target: {
          id: 'username',
          value: 'Jonny D',
        },
      })
    );

    expect(user(testUser, action)).toEqual({
      ...testUser,
      username: 'Jonny D',
    });
  });

  it('can handle SUBMIT_USER', done => {
    mockStore.dispatch(submitUser({ preventDefault() {} }, testUser));

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([
        { type: 'SUBMIT_USER' },
        {
          type: 'RECIEVE_USER',
          user: testUser,
        },
      ]);
      done();
    });
  });

  it('can handle REQUEST_USER and RECIEVE_USER', done => {
    mockStore.dispatch(fetchUser());

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([
        { type: 'REQUEST_USER' },
        {
          type: 'RECIEVE_USER',
          user: testUser,
        },
      ]);
      done();
    });
  });

  it('can handle LOGOUT_USER', done => {
    mockStore.dispatch(logoutUser());

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([{ type: 'LOGOUT_USER' }]);
      done();
    });
  });
});
