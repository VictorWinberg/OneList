import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLanguages,
  setActiveLanguage,
  getActiveLanguage,
} from 'react-localize-redux';

class SetLanguage extends Component {
  componentWillReceiveProps(props) {
    const { user, languages, myLanguage, setLanguage } = props;
    const prevLanguage = this.props.user.language;
    if (
      user.language &&
      prevLanguage !== user.language &&
      myLanguage !== user.language &&
      languages.includes(user.language)
    ) {
      setLanguage(user.language);
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
  myLanguage: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLanguage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myLanguage: getActiveLanguage(state.locale).code,
  languages: getLanguages(state.locale).map(language => language.code),
  user: state.user,
});

const mapDispatchToProps = {
  setLanguage: setActiveLanguage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetLanguage);
