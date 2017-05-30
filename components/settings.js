import React from 'react';
import PropTypes from 'prop-types';
import { grey500 } from 'material-ui/styles/colors';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import {
  Dialog,
  FlatButton,
  IconButton,
  Slider,
  Toggle,
} from 'material-ui';
import * as _ from 'lodash';

const styles = {
  settingButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemText: {
    marginTop: 23,
    marginRight: 20,
    flexShrink: 0,
  },
  slider: {
    flex: 1,
    marginRight: 20,
  },
  toggle: {
    marginTop: 20,
  },
  numberInput: {
    width: 60,
    marginTop: 7,
  },
  numberInputContent: {
    textAlign: 'center',
  },
};

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      repeatThreshold: props.repeatThreshold,
      shouldAutoTranslate: props.shouldAutoTranslate,
      shouldPronounce: props.shouldPronounce,
    };
  }

  handleOpen = () => {
    this.setState({
      isOpen: true,
      repeatThreshold: this.props.repeatThreshold,
      shouldAutoTranslate: this.props.shouldAutoTranslate,
      shouldPronounce: this.props.shouldPronounce,
    });
  };

  handleClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleRepeatThresholdChange = (event, value) => {
    this.setState({
      repeatThreshold: value,
    });
  };

  handleShouldAutoTranslateToggle = (event, value) => {
    this.setState({
      shouldAutoTranslate: value,
    });
  };

  handleShouldPronounceToggle = (event, value) => {
    this.setState({
      shouldPronounce: value,
    });
  };

  handleSubmit = () => {
    this.props.onSave({
      repeatThreshold: this.state.repeatThreshold,
      shouldAutoTranslate: this.state.shouldAutoTranslate,
      shouldPronounce: this.state.shouldPronounce,
    });
    this.handleClose();
  };

  actions = [
    <FlatButton
      label="Cancel"
      primary
      onTouchTap={this.handleClose}
    />,
    <FlatButton
      label="Submit"
      primary
      onTouchTap={this.handleSubmit}
    />,
  ];

  render() {
    return (
      <div>
        <IconButton onTouchTap={this.handleOpen} style={styles.settingButton}>
          <SettingsIcon color={grey500} />
        </IconButton>
        <Dialog
          title="Settings"
          actions={this.actions}
          modal={false}
          open={this.state.isOpen}
          onRequestClose={this.handleClose}
        >
          <div style={styles.item}>
            <div style={styles.itemText}>Repeat Threshold</div>
            <Slider
              style={styles.slider}
              step={1}
              min={1}
              max={10}
              value={this.state.repeatThreshold}
              onChange={this.handleRepeatThresholdChange}
            />
            <div style={styles.itemText}>{this.state.repeatThreshold}</div>
          </div>
          <div style={styles.item}>
            <div style={styles.itemText}>Auto Translation</div>
            <Toggle
              style={styles.toggle}
              toggled={this.state.shouldAutoTranslate}
              onToggle={this.handleShouldAutoTranslateToggle}
            />
          </div>
          <div style={styles.item}>
            <div style={styles.itemText}>Pronunciation</div>
            <Toggle
              style={styles.toggle}
              toggled={this.state.shouldPronounce}
              onToggle={this.handleShouldPronounceToggle}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

Settings.propTypes = {
  repeatThreshold: PropTypes.number.isRequired,
  shouldAutoTranslate: PropTypes.bool.isRequired,
  shouldPronounce: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
};

Settings.defaultProps = {
  onSave: _.noop,
};

export default Settings;
