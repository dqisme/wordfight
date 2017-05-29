import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, TextField } from 'material-ui';
import * as _ from 'lodash';

import Word from '../models/word';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    textAlign: 'left',
    margin: 20,
  },
};

class EditingDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      word: props.word,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      word: nextProps.word,
    });
  }

  handleInputChange = (field, value) => {
    this.setState({
      word: _.clone(this.state.word).set(field, value),
    });
  };

  actions = [
    <FlatButton
      label="Delete"
      secondary
      onTouchTap={this.props.onDelete}
    />,
    <FlatButton
      label="Update"
      primary
      onTouchTap={() => this.props.onUpdate(this.state.word)}
    />,
  ];

  render() {
    return (
      <Dialog
        title="Edit word"
        actions={this.actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.onClose}
      >
        <div style={styles.container}>
          {_.keys(this.state.word).map(field => (
            <TextField
              key={field}
              style={styles.input}
              value={this.state.word[field]}
              onChange={({ target: { value } }) => this.handleInputChange(field, value)}
            />
          ))}
        </div>
      </Dialog>
    );
  }
}

EditingDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  word: PropTypes.shape(Word),
};

EditingDialog.defaultProps = {
  onClose: _.noop,
  onDelete: _.noop,
  onUpdate: _.noop,
  word: new Word('', ''),
};

export default EditingDialog;
