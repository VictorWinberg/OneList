import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAutosuggest from 'react-autosuggest';
import deleteicon from '../assets/icons/delete.svg';

class Autosuggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
    };
  }

  render() {
    const { suggestions } = this.state;
    const {
      id,
      value,
      placeholder,
      onSelect,
      onChange,
      getSuggestions,
    } = this.props;

    return (
      <ReactAutosuggest
        multiSection
        suggestions={suggestions}
        onSuggestionSelected={onSelect}
        onSuggestionsFetchRequested={info =>
          this.setState({ suggestions: getSuggestions(info.value) })
        }
        onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
        getSuggestionValue={suggestion => suggestion}
        getSectionSuggestions={section => section.suggestions}
        renderSuggestion={suggestion => (
          <div className="suggestions">
            <span>{suggestion.name}</span>
            <img
              className="delete-icon"
              name="delete"
              src={deleteicon}
              alt="Delete"
              height="18px"
            />
          </div>
        )}
        renderSectionTitle={section => <strong>{section.title}</strong>}
        inputProps={{ id, value, placeholder, onChange }}
      />
    );
  }
}

Autosuggest.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
};

export default Autosuggest;
