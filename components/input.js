import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import * as _ from 'lodash';

const styles = {
  input: {
    textAlign: 'left',
    margin: 20,
  },
};

class Input extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.initialState;
  }

  getUnderlineStyle = () => (this.props.value ? null : {
    width: `${((this.state.repeatCount + 1) * 100) / this.state.repeatThreshold}%`,
    transformOrigin: 'center left',
  });

  initialState = {
    value: this.props.value,
    savedValue: '',
    error: '',
    repeatCount: 0,
    repeatThreshold: this.props.repeatThreshold,
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (this.state.savedValue && this.state.value !== this.state.savedValue) {
        this.setState({
          error: 'Wrong!',
        });
      } else {
        if (this.state.repeatCount < this.state.repeatThreshold) {
          this.setState({
            error: '',
            savedValue: this.state.value,
            repeatCount: Math.min(this.state.repeatCount + 1, this.state.repeatThreshold),
          }, () => {
            if (this.state.repeatCount === this.state.repeatThreshold) {
              this.props.onRepeatDone();
            }
          });
        }
        this.props.onCorrect();
      }
    }
  };

  render() {
    return (
      <TextField
        value={this.state.value}
        onChange={this.handleChange}
        ref={(component) => {
          this.textField = component;
        }}
        hintText={_.startCase(this.props.field)}
        errorText={this.state.error}
        style={styles.input}
        underlineFocusStyle={this.getUnderlineStyle()}
        onKeyDown={this.props.value ? _.noop : this.handleKeyDown}
      />
    );
  }
}

Input.propTypes = {
  field: PropTypes.string.isRequired,
  repeatThreshold: PropTypes.number.isRequired,
  onCorrect: PropTypes.func,
  onRepeatDone: PropTypes.func,
  value: PropTypes.string,
};

Input.defaultProps = {
  onCorrect: _.noop,
  onRepeatDone: _.noop,
  value: '',
};

export default Input;
