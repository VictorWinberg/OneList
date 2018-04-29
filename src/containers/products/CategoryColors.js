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

  renderColorList (colors){
    return(
    colors.map(color => (
      <li
        role="presentation"
        onClick={() => this.setState({ btnColor: color.name})} 
        style={{ backgroundColor: color.name}}
      />
    )))
  }
  
  render() {
    const colors = [
    { name: '#ffc2b3' }, { name: '#ffb3b3' }, { name: '#ffb3d9' }, { name: '#f0c2e0' }, 
    { name: '#ffb3ff' }, { name: '#d9b3ff' }, { name: '#c2c2f0' }, { name: '#b3b3ff' }, 
    { name: '#b3d9ff' }, { name: '#b3e6ff' }, { name: '#b3ffff' }, { name: '#b3ffd9' }, 
    { name: '#b3ffcc' }, { name: '#e6ffb3' }, { name: '#ffffb3' }, { name: '#ffe0b3' }];

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
            {this.renderColorList(colors)}
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
