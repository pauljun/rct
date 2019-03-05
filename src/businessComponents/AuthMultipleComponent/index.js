import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('menu')
@observer
class AuthMultipleComponent extends React.Component {
	render() {
		let { menu, actionNames, noAuthContent } = this.props;
		let action = false;
		actionNames.map((actionName) => {
			let isAuth = menu.getInfoByName(actionName);
			if (!!isAuth) {
				action = true;
			}
		});
		if (!action) {
			return noAuthContent ? noAuthContent : null;
		} else {
			return React.cloneElement(this.props.children);
		}
	}
}

export default AuthMultipleComponent;