import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import List from '../../components/List';

const mapStateToProps = state => ({
  items: state.categories,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = () => ({
  onItemClick: () => console.log('Not implemented'),
  onRemoveItems: () => console.log('Not implemented'),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
