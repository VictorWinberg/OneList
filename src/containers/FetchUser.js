import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLanguages,
  setActiveLanguage,
  getActiveLanguage,
} from 'react-localize-redux';

import { fetchUser } from '../actions/user';

class FetchUser extends Component {
  componentDidMount() {
    const { retrieveUser } = this.props;
    retrieveUser();
  }

  componentWillReceiveProps(props) {
    const { user, languages, currentLanguage, setLanguage } = props;
    if (
      user.email &&
      !user.isFetching &&
      currentLanguage !== user.language &&
      languages.includes(user.language) &&
      this.props.user.language !== user.language
    ) {
      setLanguage(user.language);
    }
  }

  render() {
    return null;
  }
}

FetchUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    isFetching: PropTypes.bool,
    language: PropTypes.string,
  }).isRequired,
  currentLanguage: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLanguage: PropTypes.func.isRequired,
  retrieveUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  languages: getLanguages(state.locale).map(language => language.code),
  user: state.user,
});

const mapDispatchToProps = {
  setLanguage: setActiveLanguage,
  retrieveUser: fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchUser);
