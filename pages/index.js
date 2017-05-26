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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 200,
  },
  input: {
    textAlign: 'left',
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
      ...this.initialWordAndMeaningState,
    };
  }

  initialWordAndMeaningState = {
    word: '',
    meaning: '',
    targetWord: '',
    targetMeaning: '',
    wordError: '',
    meaningError: '',
    wordRepeatCount: 0,
    wordRepeatThreshold: 5,
    meaningRepeatCount: 0,
    meaningRepeatThreshold: 5,
  };

  checkDone = () => {
    if (this.state.wordRepeatCount === this.state.wordRepeatThreshold &&
        this.state.meaningRepeatCount === this.state.meaningRepeatThreshold) {
      this.setState({
        ...this.initialWordAndMeaningState,
      });
    }
  };

  handleWordInputChange = (event) => {
    this.setState({ word: event.target.value });
  };

  handleMeaningInputChange = (event) => {
    this.setState({ meaning: event.target.value });
  };

  handleWordInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      let targetWord = '';
      if (this.state.targetWord && this.state.word !== this.state.targetWord) {
        this.setState({
          wordError: 'Wrong!',
        });
      } else {
        targetWord = this.state.word;
        this.setState({
          meaning: '',
          wordError: '',
          targetWord,
          wordRepeatCount:
            Math.min(this.state.wordRepeatCount + 1, this.state.wordRepeatThreshold),
        }, this.checkDone);
        this.meaningInput.focus();
      }
    }
  };

  handleMeaningInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      let targetMeaning = '';
      if (this.state.targetMeaning && this.state.meaning !== this.state.targetMeaning) {
        this.setState({
          meaningError: 'Wrong!',
        });
      } else {
        targetMeaning = this.state.meaning;
        this.setState({
          word: '',
          meaningError: '',
          targetMeaning,
          meaningRepeatCount:
            Math.min(this.state.meaningRepeatCount + 1, this.state.meaningRepeatThreshold),
        }, this.checkDone);
        this.wordInput.focus();
      }
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
            errorText={this.state.wordError}
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
            errorText={this.state.meaningError}
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
