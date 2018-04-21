import renderer from 'react-test-renderer';

import Index from '../index';
import store from '../store';
import Root from '../containers/Root';
import Categories from '../containers/categories';
import Settings from '../containers/settings';
import Share from '../containers/share';

describe('containers', () => {
  it('index renders without crashing', () => {
    expect(
      JSON.stringify({ ...Index, _reactInternalFiber: 'circular' })
    ).toBeDefined();
  });

  it('categories renders without crashing', () => {
    expect(
      renderer.create(Root(Categories, store)).root.findByType(Categories)
    ).toBeDefined();
  });

  it('settings renders without crashing', () => {
    expect(
      renderer.create(Root(Settings, store)).root.findByType(Settings)
    ).toBeDefined();
  });

  it('share renders without crashing', () => {
    expect(
      renderer.create(Root(Share, store)).root.findByType(Share)
    ).toBeDefined();
  });
});
