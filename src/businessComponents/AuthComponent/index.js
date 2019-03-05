import React from 'react';
import { observer, inject } from 'mobx-react';


@inject('menu')
@observer
class AuthComponent extends React.Component {
	render() {
		let { menu, actionName, noAuthContent } = this.props;
		let action = menu.getInfoByName(actionName); //获取按钮权限
		if (!action) {
			return noAuthContent ? noAuthContent : null;
		} else {
			return React.cloneElement(this.props.children);
		}
	}
}

export default AuthComponent;
