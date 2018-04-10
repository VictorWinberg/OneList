import { render } from 'react-dom';

import App from './containers/App';
import Root from './containers/Root';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

const Index = render(
  Root(App, store),
  document.getElementById('root') || document.createElement('div')
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./containers/App').default;
    render(Root(NextApp, store), document.getElementById('root'));
  });
}

export default Index;
