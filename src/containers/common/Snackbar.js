import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Snackbar = ({ isLoggedIn }) => (
  <div>
    {!isLoggedIn && (
      <div id="unauthenticated">
        You are not logged in. Please log in and try again.
      </div>
    )}
  </div>
);
Snackbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: !!state.user.email,
});

export default connect(mapStateToProps)(Snackbar);
