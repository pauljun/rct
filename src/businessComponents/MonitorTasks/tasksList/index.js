import React from 'react'
import { Button, List } from 'antd'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import './index.less'
// 加载组件
const TaskItem = Loader.loadBusinessComponent('MonitorTasks', 'TaskItem')
const NoDataComp = Loader.NoData
const InputSearch = Loader.loadBaseComponent('SearchInput')
const IconFont = Loader.loadBaseComponent('IconFont')
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent')
const AuthComponent = Loader.loadBusinessComponent('AuthComponent')

@withRouter
@Decorator.businessProvider('tab')
@observer
class TasksList extends React.Component {
	/**
   * @desc 跳转到添加布控任务页面
   */
  addTask = () => {
		const { tab, location, moduleName } = this.props
    tab.goPage({
      moduleName,
      location,
			isUpdate: true
    })
	}
	render() {
    const {
      list,
			item,
			libType,
      isShowModel,
      handleCancel,
      handleOk,
      delLibName,
      changeVal,
      setItemById,
      delTasksModel,
      onStartPauseBtnClick
		} = this.props
		return (
			<div className='monitor-tasks-list-left'>
				<ConfirmComponent
					title="删除确认"
					visible={isShowModel}
					onCancel={handleCancel}
					onOk={handleOk}
					img='delete'
					className='monitor-tasks-model'
				>
					<div className='model-content'>
						<div className="title-name">
							你确定要删除 <span>{delLibName}</span> ?
						</div>
					</div>
				</ConfirmComponent>
				<div className="create-new-tasks">
					<AuthComponent actionName='keyPersonnelTaskManage'>
						<Button type='primary' onClick={this.addTask}><IconFont type='icon-Zoom__Light'/>新建任务</Button>
					</AuthComponent>
				</div>
				<div className='search-group'>
					<InputSearch
						placeholder='请输入任务名称搜索'
						onChange={changeVal}
						style={{ width: '100%' }} 
						isEnterKey={true}
					/>
				</div>
				<div className='list task-list'>
					<List
						locale={{emptyText: <NoDataComp title='暂无布控任务'/>}}
						dataSource={list}
						renderItem={v => (
							<List.Item key={v.id}>
								<TaskItem 
									setItemById={setItemById}
									delTasksModel={delTasksModel}
									onStartPauseBtnClick={onStartPauseBtnClick}
									activeItem={item}
									item={v}
									libType={libType}
								/>
							</List.Item>
						)}
					>
					</List>
				</div>
			</div>
		)
	}
}

export default TasksList