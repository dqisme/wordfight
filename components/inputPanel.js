import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import Input from './input';
import Word from '../models/word';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};

class InputPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  getWord = () =>
    this.fields
      .map(field => ({
        [field.name]: this.props.editingWord === InputPanel.defaultProps.editingWord ?
          field.ref.state.savedValue : field.ref.state.value,
      })).reduce(_.assign);

  getNextField = currentFieldIndex => this.fields[(currentFieldIndex + 1) % this.fields.length].ref;

  handleRepeatDone = () => {
    const isAllFieldsRepeatDone =
      this.fields.every(field => field.ref.state.repeatCount === field.ref.state.repeatThreshold);
    if (isAllFieldsRepeatDone) {
      this.props.onSave(this.getWord());
      this.fields.forEach(field => field.ref.setState({ ...field.ref.initialState }));
    }
  };

  fields = Object.keys(new Word()).map(field => ({
    name: field,
    ref: null,
  }));

  render() {
    return (
      <div style={styles.container}>
        {this.fields.map((field, index) => (
          <Input
            key={field.name}
            repeatThreshold={this.props.repeatThreshold}
            field={field.name}
            value={this.props.editingWord[field.name]}
            ref={(inputRef) => {
              this.fields[index].ref = inputRef;
            }}
            onCorrect={() => {
              this.getNextField(index).textField.focus();
              this.getNextField(index).setState({ value: '' });
            }}
            onRepeatDone={this.handleRepeatDone}
          />
        ))}
      </div>
    );
  }
}

InputPanel.propTypes = {
  onSave: PropTypes.func,
  repeatThreshold: PropTypes.number,
  editingWord: PropTypes.shape(Word),
};

InputPanel.defaultProps = {
  onSave: _.noop,
  repeatThreshold: 1,
  editingWord: new Word('', ''),
};

export default InputPanel;
