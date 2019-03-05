import React from 'react'

const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const IconSpan = Loader.loadBaseComponent('IconSpan');
const LibHeader = Loader.loadBusinessComponent("MonitorLibrary", "LibHeader");


class MachineDetail extends React.Component {

  render() {
    let { onEdit, actionName, children=null } = this.props

    return (
      <div className='monitee-lib-info-wrapper'>
        <LibHeader title={'专网库详情'}>
          <div className='lib-info-edit'>
            <AuthComponent actionName={actionName}>
              <IconSpan 
                className='span-btn'  
                mode='inline'
                icon="icon-Edit_Main" 
                onClick={onEdit} 
                label='编辑' 
              />
            </AuthComponent>
          </div>
        </LibHeader>
        { children }
      </div> 
    )
  }
}

export default MachineDetail