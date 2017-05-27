import React from 'react';
import { IconButton } from 'material-ui';
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
    this.state = {};
  }

  render() {
    return (
      <div>
        <IconButton style={styles.settingButton}>
          <SettingsIcon color={grey500} />
        </IconButton>
      </div>
    );
  }
}
export default Settings;
