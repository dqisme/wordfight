import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { TextField } from 'material-ui';

// Make sure react-tap-event-plugin only gets injected once
// Needed for material-ui
if (!process.tapEventInjected) {
  injectTapEventPlugin();
  process.tapEventInjected = true;
}

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
  input: {
    margin: 20,
  },
};

const muiTheme = {
  palette: {
    accent1Color: deepOrange500,
  },
};

class Index extends React.Component {
  static getInitialProps({ req }) {
    // Ensures material-ui renders the correct css prefixes server-side
    let userAgent;
    if (process.browser) {
      userAgent = global.navigator.userAgent;
    } else {
      userAgent = req.headers['user-agent'];
    }

    return { userAgent };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      word: '',
      meaning: '',
    };
  }

  handleWordInputChange = (event) => {
    this.setState({ word: event.target.value });
  };

  handleMeaningInputChange = (event) => {
    this.setState({ meaning: event.target.value });
  };

  handleWordInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({ meaning: '' });
      this.meaningInput.focus();
    }
  };

  handleMeaningInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({ word: '' });
      this.wordInput.focus();
    }
  };

  render() {
    const { userAgent } = this.props;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme({ userAgent, ...muiTheme })}>
        <div style={styles.container}>
          <TextField
            value={this.state.word}
            onChange={this.handleWordInputChange}
            ref={(component) => {
              this.wordInput = component;
            }}
            hintText="Word"
            style={styles.input}
            onKeyDown={this.handleWordInputKeyDown}
          />
          <TextField
            value={this.state.meaning}
            onChange={this.handleMeaningInputChange}
            ref={(component) => {
              this.meaningInput = component;
            }}
            style={styles.input}
            hintText="Meaning"
            onKeyDown={this.handleMeaningInputKeyDown}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

Index.propTypes = {
  userAgent: React.PropTypes.string.isRequired,
};

export default Index;
