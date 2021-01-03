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
    fetch.resetMocks();
  });

  it('has a default state', () => {
    expect(user(undefined, { type: 'unexpected' })).toEqual({
      isFetching: false,
      isSubmitting: false,
      isCollaboration: true
    });
  });

  it('can handle UPDATE_USER', () => {
    const action = dispatch(
      updateUser({
        target: {
          id: 'username',
          value: 'Johnny D',
        },
      })
    );

    expect(user(testUser, action)).toEqual({
      ...testUser,
      username: 'Johnny D',
    });
  });

  it('can handle SUBMIT_USER', done => {
    fetch.mockResponse(JSON.stringify(testUser));
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

  it('can handle SUBMIT_USER with error', done => {
    fetch.mockResponses(
      [
        JSON.stringify({ error: 'Something went wrong' }),
        {
          status: 400,
        },
      ],
      [
        JSON.stringify(testUser),
        {
          status: 200,
        },
      ]
    );

    mockStore.dispatch(
      submitUser({ preventDefault() {} }, { username: 'New' })
    );

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([
        { type: 'SUBMIT_USER' },
        { type: 'REQUEST_USER' },
        {
          type: 'RECIEVE_USER',
          user: testUser,
        },
      ]);
      done();
    });
  });

  it('can handle REQUEST_USER and RECIEVE_USER', done => {
    fetch.mockResponse(JSON.stringify(testUser));
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
    fetch.mockResponse('{}');
    mockStore.dispatch(logoutUser());

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([{ type: 'LOGOUT_USER' }]);
      done();
    });
  });
});
