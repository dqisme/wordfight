import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import * as _ from 'lodash';

import Word from '../models/word';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 200,
  },
};

class RepeatPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      word: this.initialWord,
      repeatCount: 0,
      currentFieldIndex: 0,
      inputValue: '',
      inputError: '',
    };
  }

  initialWord = new Word('', '');

  wordFields = _.keys(this.initialWord);

  get previousFieldIndex() {
    return (this.state.currentFieldIndex + -1 + this.wordFields.length) % this.wordFields.length;
  }

  get nextFieldIndex() {
    return (this.state.currentFieldIndex + 1) % this.wordFields.length;
  }

  get currentField() {
    return this.wordFields[this.state.currentFieldIndex];
  }

  get inputUnderlineStyle() {
    return {
      width: `${Math.min(((this.state.repeatCount + 1) * 100) / this.props.repeatThreshold, 100)}%`,
      transformOrigin: 'center left',
    };
  }

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const isFirstTime = _.isEmpty(this.state.word[this.currentField]);
      const isCorrect = this.state.inputValue === this.state.word[this.currentField];
      const isLastField = this.state.currentFieldIndex === this.wordFields.length - 1;
      let updatedWord = this.state.word;
      let updatedRepeatCount = this.state.repeatCount;
      if (isFirstTime && !isCorrect) {
        updatedWord = _.assign(_.clone(this.state.word), {
          [this.currentField]: this.state.inputValue,
        });
      }
      if (isLastField) {
        if ((isFirstTime && !isCorrect) || (!isFirstTime && isCorrect)) {
          updatedRepeatCount = this.state.repeatCount + 1;
          if (updatedRepeatCount >= this.props.repeatThreshold) {
            updatedRepeatCount = 0;
            updatedWord = this.initialWord;
            this.props.onSave(this.state.word);
          }
        }
      }
      this.setState({
        word: updatedWord,
        repeatCount: updatedRepeatCount,
        currentFieldIndex:
          (isCorrect || isFirstTime) ? this.nextFieldIndex : this.state.currentFieldIndex,
        inputValue:
          (isCorrect || isFirstTime) ? '' : this.state.inputValue,
        inputError:
          (isCorrect || isFirstTime) ? '' : 'Wrong!',
      });
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <h1>{this.state.word[this.wordFields[this.previousFieldIndex]]}</h1>
        <TextField
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          hintText={_.startCase(this.currentField)}
          onKeyDown={this.handleInputKeyDown}
          errorText={this.state.inputError}
          underlineFocusStyle={this.inputUnderlineStyle}
        />
      </div>
    );
  }
}

RepeatPanel.propTypes = {
  repeatThreshold: PropTypes.number.isRequired,
  onSave: PropTypes.func,
};

RepeatPanel.defaultProps = {
  onSave: _.noop,
};

export default RepeatPanel;
