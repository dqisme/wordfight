import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField } from 'material-ui';
import { grey500 } from 'material-ui/styles/colors';
import CancelIcon from 'material-ui/svg-icons/content/clear';
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
  inputWrapper: {
    position: 'relative',
  },
  cancelButton: {
    position: 'absolute',
    right: 0,
  },
  atop: {
    top: 0,
  },
  beneath: {
    bottom: 0,
  },
};

const initialState = {
  word: new Word('', ''),
  repeatCount: 0,
  currentFieldIndex: 0,
  inputValue: '',
  inputError: '',
  inputLabel: '',
  isInputDisabled: false,
};
const wordFields = _.keys(initialState.word);

class RepeatPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = initialState;
  }

  get previousFieldIndex() {
    return (this.state.currentFieldIndex + -1 + wordFields.length) % wordFields.length;
  }

  get nextFieldIndex() {
    return (this.state.currentFieldIndex + 1) % wordFields.length;
  }

  get currentField() {
    return wordFields[this.state.currentFieldIndex];
  }

  get inputUnderlineStyle() {
    return {
      width: this.state.isInputDisabled ?
        0 : `${Math.min(((this.state.repeatCount + 1) * 100) / this.props.repeatThreshold, 100)}%`,
      transformOrigin: 'center left',
    };
  }

  get cancelButtonStyle() {
    return Object.assign({},
      styles.cancelButton,
      this.state.inputError ? styles.atop : styles.beneath,
    );
  }

  get shouldShouldCancelButton() {
    return wordFields.some(field => !_.isEmpty(this.state.word[field])) &&
      !this.state.isInputDisabled;
  }

  handleInputCancel = () => {
    this.setState({ ...initialState });
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const isFirstTime = _.isEmpty(this.state.word[this.currentField]);
      const isCorrect = this.state.inputValue === this.state.word[this.currentField];
      const isLastField = this.state.currentFieldIndex === wordFields.length - 1;
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
          updatedWord.translate((response) => {
            this.input.blur();
            this.setState({
              isInputDisabled: false,
              inputValue: response.translation || '',
              inputLabel: '',
              inputError: response.error || '',
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
            updatedWord = initialState.word;
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
        <h1>{this.state.word[wordFields[this.previousFieldIndex]]}</h1>
        <div style={styles.inputWrapper}>
          {
            this.shouldShouldCancelButton &&
            <IconButton onTouchTap={this.handleInputCancel} style={this.cancelButtonStyle}>
              <CancelIcon color={grey500} />
            </IconButton>
          }
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
