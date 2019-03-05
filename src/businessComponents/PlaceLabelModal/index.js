import React from 'react';
import './index.less';
const ModalComponent = Loader.loadBaseComponent('ModalComponent');

class PlaceLabelModal extends React.Component {

  render() {
    let { visible, onCancel ,onOk,bigDatePlaceType,placeFeature,itemClick,placeTags=[]} = this.props;
    return (
      <ModalComponent
        className="place-label-modal"
        visible={visible}
        onOk={() => onOk && onOk()}
        onCancel={() => onCancel && onCancel()}
        width="460px"
        title="编辑场所标签"
      >
        <div className='place-label-view'>
          <div className='c-checkbox'>
            <div className='label'>
              类型：
            </div>
            <div className='label-box'>
            {
              bigDatePlaceType.map(v => {
                return <div className={`label-item ${placeTags.indexOf(v.value)>=0 && 'active'}`} onClick={itemClick.bind(this,v.value)}>
                 {v.label}
                </div>
              })
            }
            </div>
          </div>
          <div className='c-checkbox'>
            <div className='label'>
              特征：
            </div>
            <div className='label-box'>
            {
              placeFeature.map(v => {
                return <div className={`label-item ${placeTags.indexOf(v.value)>=0 && 'active'}`} onClick={itemClick.bind(this,v.value)}>
                 {v.label}
                </div>
              })
            }
            </div>
          </div>
        </div>
      </ModalComponent>
    );
  }
}

export default PlaceLabelModal;
