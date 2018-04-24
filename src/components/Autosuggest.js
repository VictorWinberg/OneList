import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAutosuggest from 'react-autosuggest';

class Autosuggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
    };
  }

  render() {
    const { suggestions } = this.state;
    const { value, placeholder, getSuggestions, onChange } = this.props;

    return (
      <ReactAutosuggest
        multiSection
        highlightFirstSuggestion
        suggestions={suggestions}
        onSuggestionsFetchRequested={info =>
          this.setState({ suggestions: getSuggestions(info.value) })
        }
        onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
        getSuggestionValue={suggestion => suggestion}
        getSectionSuggestions={section => section.products}
        renderSuggestion={suggestion => <div>{suggestion}</div>}
        renderSectionTitle={section => <strong>{section.category}</strong>}
        inputProps={{ value, placeholder, onChange }}
      />
    );
  }
}

Autosuggest.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
};

export default Autosuggest;