import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Chip, Dialog, FlatButton, TextField } from 'material-ui';
import * as _ from 'lodash';

// Make sure react-tap-event-plugin only gets injected once
// Needed for material-ui
if (!process.tapEventInjected) {
  injectTapEventPlugin();
  process.tapEventInjected = true;
}

const styles = {
  container: {
    paddingTop: 200,
  },
  inputPanel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    textAlign: 'left',
    margin: 20,
  },
  memoryPanel: {
    paddingLeft: 100,
    paddingRight: 100,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memory: {
    marginRight: 10,
    marginBottom: 10,
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
      memorizedWordsAndMeanings: [],
      editingMemoryIndex: this.initialEditingMemoryIndex,
    };
  }

  getWordInputUnderlineStyle = () => ({
    width: `${((this.state.wordRepeatCount + 1) * 100) / this.state.wordRepeatThreshold}%`,
    transformOrigin: 'center left',
  });

  getMeaningInputUnderlineStyle = () => ({
    width: `${((this.state.meaningRepeatCount + 1) * 100) / this.state.meaningRepeatThreshold}%`,
    transformOrigin: 'center left',
  });

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

  initialEditingMemoryIndex = -1;

  handleCancelEditingMemory = () => {
    this.setState({ editingMemoryIndex: this.initialEditingMemoryIndex });
  };

  handleDeleteEditingMemory;

  handleUpdateEditingMemory;

  checkDone = () => {
    if (this.state.wordRepeatCount === this.state.wordRepeatThreshold &&
        this.state.meaningRepeatCount === this.state.meaningRepeatThreshold) {
      this.setState({
        ...this.initialWordAndMeaningState,
        memorizedWordsAndMeanings: this.state.memorizedWordsAndMeanings.concat({
          word: this.state.targetWord,
          meaning: this.state.targetMeaning,
        }),
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

  actions = [
    <FlatButton
      label="Delete"
      secondary
      onTouchTap={this.handleDeleteEditingMemory}
    />,
    <FlatButton
      label="Update"
      primary
      onTouchTap={this.handleUpdateEditingMemory}
    />,
  ];

  render() {
    const { userAgent } = this.props;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme({ userAgent, ...muiTheme })}>
        <div style={styles.container}>
          <div style={styles.inputPanel}>
            <TextField
              value={this.state.word}
              onChange={this.handleWordInputChange}
              ref={(component) => {
                this.wordInput = component;
              }}
              hintText="Word"
              errorText={this.state.wordError}
              style={styles.input}
              underlineFocusStyle={this.getWordInputUnderlineStyle()}
              onKeyDown={this.handleWordInputKeyDown}
            />
            <TextField
              value={this.state.meaning}
              onChange={this.handleMeaningInputChange}
              ref={(component) => {
                this.meaningInput = component;
              }}
              hintText="Meaning"
              errorText={this.state.meaningError}
              style={styles.input}
              underlineFocusStyle={this.getMeaningInputUnderlineStyle()}
              onKeyDown={this.handleMeaningInputKeyDown}
            />
          </div>
          <div style={styles.memoryPanel}>
            {this.state.memorizedWordsAndMeanings.map((wordAndMeaning, index) => (
              <Chip
                onTouchTap={() => {
                  this.setState({ editingMemoryIndex: index });
                }}
                style={styles.memory}
                key={wordAndMeaning.word}
              >
                {wordAndMeaning.word}
              </Chip>
            ))}
          </div>
          <Dialog
            title="Edit word and its meaning"
            actions={this.actions}
            modal={false}
            open={this.state.editingMemoryIndex !== this.initialEditingMemoryIndex}
            onRequestClose={this.handleCancelEditingMemory}
          >
            <TextField
              defaultValue={_.get(this.state.memorizedWordsAndMeanings, [this.state.editingMemoryIndex, 'word'])}
            />
            <TextField
              defaultValue={_.get(this.state.memorizedWordsAndMeanings, [this.state.editingMemoryIndex, 'meaning'])}
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

Index.propTypes = {
  userAgent: React.PropTypes.string.isRequired,
};

export default Index;
