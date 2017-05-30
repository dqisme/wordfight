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
      inputLabel: '',
      isInputDisabled: false,
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
      width: this.state.isInputDisabled ?
        0 : `${Math.min(((this.state.repeatCount + 1) * 100) / this.props.repeatThreshold, 100)}%`,
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
      const isFirstTimeInputSuccess = isFirstTime && !isCorrect;
      const isInputSuccess = (isFirstTimeInputSuccess) || (!isFirstTime && isCorrect);

      let updatedWord = this.state.word;
      let updatedRepeatCount = this.state.repeatCount;
      let isInputDisabled = this.state.isInputDisabled;
      let inputLabel = this.state.inputLabel;
      if (isFirstTimeInputSuccess) {
        updatedWord = _.clone(this.state.word).set(this.currentField, this.state.inputValue);
        if (this.props.shouldAutoTranslate && updatedWord.canTranslate) {
          isInputDisabled = true;
          inputLabel = 'Wait for translating...';
          updatedWord.translate((translation) => {
            this.input.blur();
            this.setState({
              isInputDisabled: false,
              inputValue: translation,
              inputLabel: '',
            }, () => {
              this.input.focus();
            });
          });
        }
      }
      if (isInputSuccess) {
        if (this.props.shouldPronounce) {
          updatedWord.pronounce(this.currentField);
        }
        if (isLastField) {
          updatedRepeatCount = this.state.repeatCount + 1;
          if (updatedRepeatCount >= this.props.repeatThreshold) {
            this.props.onSave(updatedWord);
            updatedRepeatCount = 0;
            updatedWord = this.initialWord;
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
        isInputDisabled,
        inputLabel,
      });
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <h1>{this.state.word[this.wordFields[this.previousFieldIndex]]}</h1>
        <TextField
          ref={(component) => {
            this.input = component;
          }}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          hintText={_.startCase(this.currentField)}
          onKeyDown={this.handleInputKeyDown}
          errorText={this.state.inputError}
          underlineFocusStyle={this.inputUnderlineStyle}
          disabled={this.state.isInputDisabled}
          floatingLabelText={this.state.inputLabel}
        />
      </div>
    );
  }
}

RepeatPanel.propTypes = {
  repeatThreshold: PropTypes.number.isRequired,
  onSave: PropTypes.func,
  shouldAutoTranslate: PropTypes.bool,
  shouldPronounce: PropTypes.bool,
};

RepeatPanel.defaultProps = {
  onSave: _.noop,
  shouldAutoTranslate: false,
  shouldPronounce: false,
};

export default RepeatPanel;
