import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import Header from '../components/Header';

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(Header);
