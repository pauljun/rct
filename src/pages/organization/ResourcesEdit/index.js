import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import './index.less'
import ResourceButtons from './components/resourceButtons'

const ModalShow = Loader.loadBaseComponent('ModalComponent')


@withRouter
@Decorator.businessProvider("organization")
@observer
class ResourceList extends React.Component {
  render() {
    const {item,showResourceList,cancleResource,allocateResource}=this.props
    return (
        <ModalShow
          title={'分配资源'}
          visible={showResourceList}
          onCancel = {cancleResource}
          onOk = {allocateResource}
          wrapClassName= 'org-resource-modal-wrapper'
          destroyOnClose={true}
        >
          <ResourceButtons data={item}/>
        </ModalShow>
    );
  }
}

export default ResourceList;