import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    padding: '1.5rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#1a1a1a',
    backgroundColor: '#fff',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  heading: {
    margin: '0 0 1rem',
    fontSize: '1.25rem',
  },
  message: {
    margin: '0 0 1rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  stack: {
    margin: '0 0 1.5rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.75rem',
    lineHeight: 1.4,
    overflow: 'auto',
  },
  button: {
    padding: '0.625rem 1.25rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) {
      return children;
    }

    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Something went wrong</h1>
        <pre style={styles.message}>{error.toString()}</pre>
        {error.stack && <pre style={styles.stack}>{error.stack}</pre>}
        <button
          type="button"
          style={styles.button}
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
