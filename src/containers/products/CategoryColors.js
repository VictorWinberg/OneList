import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

class CategoryColors extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  render() {
    const { translate } = this.props;
    const { open } = this.state;
    const btn = (
      <div>
        <select
          type="button"
          onClick={() => this.setState({ open: !open })}
          autoComplete="off"
          defaultValue={translate('edit.selectColor')}
          style={{ backgroundColor: '#d9d9d9' }}
        />
      </div>
    );

    if (open) {
      return (
        <div>
          {btn}
          <ul className="color-list">
            <li style={{ backgroundColor: '#ffc2b3' }} />
            <li style={{ backgroundColor: '#ffb3b3' }} />
            <li style={{ backgroundColor: '#ffb3d9' }} />
            <li style={{ backgroundColor: '#f0c2e0' }} />
            <li style={{ backgroundColor: '#ffb3ff' }} />
            <li style={{ backgroundColor: '#d9b3ff' }} />
            <li style={{ backgroundColor: '#c2c2f0' }} />
            <li style={{ backgroundColor: '#b3b3ff' }} />
            <li style={{ backgroundColor: '#b3d9ff' }} />
            <li style={{ backgroundColor: '#b3e6ff' }} />
            <li style={{ backgroundColor: '#b3ffff' }} />
            <li style={{ backgroundColor: '#b3ffd9' }} />
            <li style={{ backgroundColor: '#b3ffcc' }} />
            <li style={{ backgroundColor: '#e6ffb3' }} />
            <li style={{ backgroundColor: '#ffffb3' }} />
            <li style={{ backgroundColor: '#ffe0b3' }} />
          </ul>
        </div>
      );
    }

    return <div> {btn} </div>;
  }
}

CategoryColors.propTypes = {
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps) (CategoryColors);
