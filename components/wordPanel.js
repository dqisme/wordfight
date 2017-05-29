import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from 'material-ui';
import * as _ from 'lodash';

import Word from '../models/word';


const styles = {
  container: {
    paddingTop: 10,
    paddingLeft: '10%',
    paddingRight: '10%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    marginRight: 10,
    marginBottom: 10,
  },
};

class WordPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div style={styles.container}>
        {this.props.words.map((word, index) => (
          <Chip
            onTouchTap={() => {
              this.props.onWordPress(index);
            }}
            style={styles.cell}
            key={word.spelling}
          >
            {word.spelling}
          </Chip>
        ))}
      </div>
    );
  }
}

WordPanel.propTypes = {
  words: PropTypes.arrayOf(PropTypes.shape(Word)).isRequired,
  onWordPress: PropTypes.func,
};

WordPanel.defaultProps = {
  onWordPress: _.noop,
};

export default WordPanel;
