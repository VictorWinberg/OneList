import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Snackbar = ({ isLoggedIn, isFetching }) => {
  const { t } = useTranslation();

  return (
    <div>
      {!isLoggedIn && !isFetching && (
        <div id="unauthenticated">
          {t('snackbar.unauthenticated')}
        </div>
      )}
    </div>
  );
};

Snackbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: !!state.user.email,
  isFetching: !!state.user.isFetching,
});

export default connect(mapStateToProps)(Snackbar);
