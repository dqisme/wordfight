import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton } from 'material-ui';
import * as _ from 'lodash';

import InputPanel from './inputPanel';
import Word from '../models/word';

class EditingDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  actions = [
    <FlatButton
      label="Delete"
      secondary
      onTouchTap={this.props.onDelete}
    />,
    <FlatButton
      label="Update"
      primary
      onTouchTap={this.props.onUpdate}
    />,
  ];

  render() {
    return (
      <Dialog
        title="Edit word"
        actions={this.actions}
        modal={false}
        open={this.props.isActive}
        onRequestClose={this.props.onClose}
      >
        <InputPanel
          editingWord={this.props.word}
        />
      </Dialog>
    );
  }
}

EditingDialog.propTypes = {
  isActive: PropTypes.bool.isRequired,
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
