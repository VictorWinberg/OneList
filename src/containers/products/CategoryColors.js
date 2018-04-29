import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

class CategoryColors extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
    this.state = { btnColor: '#d9d9d9' };
  }

  render() {
    const { btnColor } = this.state;
    const { translate } = this.props;
    const { open } = this.state;
    const btn = (
      <div>
        <select
          type="button"
          onClick={() => this.setState({ open: !open })}
          autoComplete="off"
          value="välj"
          style={{ backgroundColor: btnColor}}
          >
          <option selected="selected">
          {translate('edit.selectColor')}
          </option>
        </select>
      </div>
    );

    if (open) {
      return (
        <div>
          {btn}
          <ul className="color-list">
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#ffc2b3' })} 
              style={{ backgroundColor: '#ffc2b3' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#ffb3b3' })} 
              style={{ backgroundColor: '#ffb3b3' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#ffb3d9' })}
              style={{ backgroundColor: '#ffb3d9' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#f0c2e0' })}
              style={{ backgroundColor: '#f0c2e0' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#ffb3ff' })}
              style={{ backgroundColor: '#ffb3ff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#d9b3ff' })}
              style={{ backgroundColor: '#d9b3ff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#c2c2f0' })}
              style={{ backgroundColor: '#c2c2f0' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3b3ff' })}
              style={{ backgroundColor: '#b3b3ff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3d9ff' })}
              style={{ backgroundColor: '#b3d9ff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3e6ff' })}
              style={{ backgroundColor: '#b3e6ff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3ffff' })}
              style={{ backgroundColor: '#b3ffff' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3ffd9' })}
              style={{ backgroundColor: '#b3ffd9' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#b3ffcc' })}
              style={{ backgroundColor: '#b3ffcc' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#e6ffb3' })}
              style={{ backgroundColor: '#e6ffb3' }} />
            <li role="presentation"
              onClick={() => this.setState({ btnColor: '#ffffb3' })}
              style={{ backgroundColor: '#ffffb3' }} />
            <li role="presentation"
            onClick={() => this.setState({ btnColor: '#ffe0b3' })}
            style={{ backgroundColor: '#ffe0b3' }} />
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
