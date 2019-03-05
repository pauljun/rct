import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import './index.less';

@inject('actionPanel')
@observer
class ActionPanel extends React.Component {
  static propTypes = {
    actionNames: PropTypes.array.isRequired,
    condition: PropTypes.oneOf(['and', 'or']),
    className: PropTypes.string
  };
  render() {
    const {
      actionPanel,
      className,
      actionNames,
      condition = 'and'
    } = this.props;
    const flag = actionPanel.computedAction(actionNames, condition);
    const propsOptions = {
      className: `action-panel${flag ? ' disabled-space' : ''}${
        className ? ` ${className}` : ''
      }`,
      disabled: flag
    };
    return React.Children.map(this.props.children, Child => {
      return React.cloneElement(Child, propsOptions);
    });
  }
}

export default ActionPanel;
