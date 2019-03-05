import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import TabComponent from './TabComponent';

const TabPane = Tabs.TabPane;

const IconFont = Loader.loadBaseComponent('IconFont')

// @errorBoundary
@withRouter
@inject('tab', 'menu')
@observer
class TabContainer extends React.Component {
	goTab = (activeKey) => {
		const { tab } = this.props;
		tab.changeTab(activeKey);
	};
	closeTab = (activeKey) => {
		const { tab } = this.props;
		tab.deleteTab(activeKey);
	};
	render() {
		const { tab, menu } = this.props;
		const { currentId, tabList } = tab;
		return (
			<Tabs
				className={`menu-tab ${tabList.length === 1 ? 'hide-menu-tab' : ''}`}
				key="tabs"
				type={'editable-card'}
				hideAdd={true}
				animated={true}
				activeKey={currentId}
				onChange={this.goTab}
				onEdit={this.closeTab}
			>
				{tabList.map((pane, idx) => {
          const module = menu.getInfoByName(pane.moduleName);
          const { id, menuName, index, icon } = pane;
					return (
						<TabPane
							tab={
								<span title={menuName}>
									{icon && <IconFont type={icon} />}
									{menuName}
								</span>
							}
							key={id}
						>
							<TabComponent
								key={`${index}-${id}`}
								module={module}
								tabIndex={index}
								storeId={id}
							/>
						</TabPane>
					);
				})}
			</Tabs>
		);
	}
}

export default TabContainer;
