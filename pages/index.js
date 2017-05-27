import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Chip } from 'material-ui';

import InputPanel from '../components/inputPanel';
import EditingDialog from '../components/editingDialog';

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
          <EditingDialog
            isActive={this.state.editingWordIndex !== this.initialEditingWordIndex}
            onClose={this.handleCancelEditingMemory}
            onUpdate={this.handleUpdateEditingMemory}
            onDelete={this.handleDeleteEditingMemory}
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
