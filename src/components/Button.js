import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ active, onClick, filter }) => (
  <button active={active.toString()} onClick={onClick}>
    {filter}
  </button>
);

Button.propTypes = {
  active: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;