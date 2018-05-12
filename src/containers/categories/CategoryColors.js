import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { find, get } from 'lodash/fp';

import dropdownicon from '../../assets/icons/dropdown.svg';

class CategoryColors extends Component {
  constructor(props) {
    super(props);
    const { color } = props;

    this.state = { open: false, color };
  }

  renderColorList(colors) {
    return colors.map(color => (
      <li
        key={color}
        role="presentation"
        onClick={() => this.setState({ color })}
        style={{ backgroundColor: color }}
      />
    ));
  }

  render() {
    const colors = [
      '#ff8080',
      '#ff80b3',
      '#ff80df',
      '#ff80ff',
      '#aa80ff',
      '#8080ff',
      '#80b3ff',
      '#80ccff',
      '#99e6e6',
      '#80ffe5',
      '#80ff80',
      '#99e699',
      '#bfff80',
      '#dfff80',
      '#ffe680',
      '#ffbf80',
    ];

    const { open, color } = this.state;
    const { translate } = this.props;

    return (
      <label htmlFor="color-btn">
        <span>{translate('edit.color')}:</span>
        <button
          type="button"
          id="color-btn"
          onClick={() => this.setState({ open: !open })}
          style={{ backgroundColor: color }}
        >
          {translate('edit.selectColor')}
          <img
            className="add-icon"
            alt="add"
            src={dropdownicon}
            height="12px"
          />
        </button>
        <input name="color" type="hidden" value={color} />
        {open ? (
          <ul className="color-list">{this.renderColorList(colors)}</ul>
        ) : null}
      </label>
    );
  }
}

CategoryColors.defaultProps = {
  color: '#ccc',
};

CategoryColors.propTypes = {
  color: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { id }) => ({
  color: get('color', find({ id }, state.categories)),
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(CategoryColors);
