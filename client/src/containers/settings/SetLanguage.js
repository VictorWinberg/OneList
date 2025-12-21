import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

class SetLanguage extends Component {
  componentDidUpdate(prevProps) {
    const { user, i18n } = this.props;
    const prevLanguage = prevProps.user.language;
    const languages = ['en', 'sv', 'es'];

    if (
      user.language &&
      prevLanguage !== user.language &&
      i18n.language !== user.language &&
      languages.includes(user.language)
    ) {
      i18n.changeLanguage(user.language);
    }
  }

  render() {
    return null;
  }
}

SetLanguage.propTypes = {
  user: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withTranslation()(SetLanguage));
