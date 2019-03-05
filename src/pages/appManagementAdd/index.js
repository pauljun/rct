/**
 * @title 新建应用系统
 * @author wwj
 */

import React from 'react'
import { message } from 'antd'

const OperationCenterForm = Loader.loadBusinessComponent('OperationCenterForm')

class ModuleView extends React.Component {
  submit = values => {
    return Service.operation.addOperationCenter(values)
      .then(res => {
        message.success('添加成功！')
        SocketEmitter.emit(SocketEmitter.eventName.addAppManagement, res)
        return res
      })
  }
  render() {
    return (
      <div 
        className='operation-container'
        style={{padding: '20px 0 50px 0'}}
      >
        <OperationCenterForm 
          submit={this.submit}
          type='add'
        />
      </div>
    )
  }
}

export default ModuleView