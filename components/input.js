import React from 'react';
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

  getUnderlineStyle = () => ({
    width: `${((this.state.repeatCount + 1) * 100) / this.state.repeatThreshold}%`,
    transformOrigin: 'center left',
  });

  initialState = {
    value: '',
    savedValue: '',
    error: '',
    repeatCount: 0,
    repeatThreshold: 5,
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
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
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

Input.propTypes = {
  field: React.PropTypes.string.isRequired,
  onCorrect: React.PropTypes.func,
  onRepeatDone: React.PropTypes.func,
};

Input.defaultProps = {
  onCorrect: _.noop,
  onRepeatDone: _.noop,
};

export default Input;
