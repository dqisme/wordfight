import React from 'react';
import { Dialog, FlatButton, IconButton } from 'material-ui';
import { grey500 } from 'material-ui/styles/colors';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

const styles = {
  settingButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
};

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
    };
  }

  handleOpen = () => {
    this.setState({
      isOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      isOpen: false,
    });
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
      onTouchTap={this.handleClose}
    />,
  ];

  render() {
    return (
      <div>
        <IconButton onTouchTap={this.handleOpen} style={styles.settingButton}>
          <SettingsIcon color={grey500} />
        </IconButton>
        <Dialog
          title="Dialog With Actions"
          actions={this.actions}
          modal={false}
          open={this.state.isOpen}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.
        </Dialog>
      </div>
    );
  }
}
export default Settings;
