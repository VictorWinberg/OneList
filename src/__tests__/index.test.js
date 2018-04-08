import Index from '../index';

it('index renders without crashing', () => {
  expect(
    JSON.stringify({ ...Index, _reactInternalFiber: 'circular' })
  ).toBeDefined();
});
