import filter from '../../reducers/filter';
import setVisibilityFilter from '../../actions/filter';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/filter';

describe('filter reducer', () => {
  it('has a default state', () => {
    expect(filter(undefined, { type: 'unexpected' })).toEqual(SHOW_ALL);
  });

  it('can handle SET_VISIBILITY_FILTER', () => {
    expect(filter(undefined, setVisibilityFilter(SHOW_COMPLETED))).toEqual(
      SHOW_COMPLETED
    );
    expect(filter(SHOW_ACTIVE, setVisibilityFilter(undefined))).toEqual(
      SHOW_ACTIVE
    );
  });
});
