/* eslint-disable import/no-import-module-exports */
import { createRoot } from 'react-dom/client';

import './i18n';
import App from './containers/App';
import Root from './containers/Root';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

const container =
  document.getElementById('root') || document.createElement('div');
const root = createRoot(container);
root.render(Root(App, store));
registerServiceWorker();

if (module.hot) {
  // eslint-disable-next-line import/no-import-module-exports
  module.hot.accept('./containers/App', () => {
    // eslint-disable-next-line global-require, import/no-import-module-exports
    const NextApp = require('./containers/App').default;
    root.render(Root(NextApp, store));
  });
}
