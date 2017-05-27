import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Chip, Dialog, FlatButton, TextField } from 'material-ui';
import * as _ from 'lodash';

import InputPanel from '../components/inputPanel';

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
  memoryPanel: {
    paddingLeft: 100,
    paddingRight: 100,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordCell: {
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
      words: [],
      editingWordIndex: this.initialEditingWordIndex,
    };
  }
  initialEditingWordIndex = -1;

  handleSave = (savedWord) => {
    this.setState({
      words: this.state.words.concat(savedWord),
    });
  };

  handleCancelEditingMemory = () => {
    this.setState({ editingWordIndex: this.initialEditingWordIndex });
  };

  handleDeleteEditingMemory;

  handleUpdateEditingMemory;

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
          <InputPanel onSave={this.handleSave} />
          <div style={styles.memoryPanel}>
            {this.state.words.map((word, index) => (
              <Chip
                onTouchTap={() => {
                  this.setState({ editingWordIndex: index });
                }}
                style={styles.wordCell}
                key={word.spelling}
              >
                {word.spelling}
              </Chip>
            ))}
          </div>
          <Dialog
            title="Edit word and its meaning"
            actions={this.actions}
            modal={false}
            open={this.state.editingWordIndex !== this.initialEditingWordIndex}
            onRequestClose={this.handleCancelEditingMemory}
          >
            <TextField
              defaultValue={_.get(this.state.words, [this.state.editingWordIndex, 'spelling'])}
            />
            <TextField
              defaultValue={_.get(this.state.words, [this.state.editingWordIndex, 'meaning'])}
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
