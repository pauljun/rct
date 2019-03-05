import React,{ Component } from 'react';
import { Checkbox, message } from 'antd';
import UploadPeople from '../components/UploadPeople';
import PeopleCard from '../components/PeopleCard';
import './index.less';

const Pagination = Loader.loadBaseComponent('Pagination');
const LibHeader = Loader.loadBusinessComponent('MonitorLibrary','LibHeader');
const IconSpan = Loader.loadBaseComponent('IconSpan');
const AuthComponent = Loader.loadBusinessComponent('AuthComponent');

class LibPeople extends Component {
  state={
    checkList: [],
    pageSize: 12,
    current: 1,
  }

  /**
   * @desc 单个选中改变
   */
  checkItemChange = (e, item) => {
    let { checkList } = this.state;
    if(e.target.checked){
      checkList.push(item.id)
    } else {
      checkList = checkList.filter(v => v !== item.id);
    }
    this.setState({
      checkList
    })
  }

  /**
   * @desc 全选改变事件
   */
  checkAllChange = (e, listData) => {
    const checkList = e.target.checked ? listData.map(v => v.id) : [];
    this.setState({
      checkList
    })
  }

  /**
   * @desc 判断是否应该重置current
   */
  resetCurrent = (isdelItem) => {
    let total = (this.props.libDetail.objectMainList || []).length;
    let { current, pageSize, checkList } = this.state;
    let delLength = isdelItem ? 1 : checkList.length;
    let currentTotal = total - delLength
    if(currentTotal - pageSize * (current - 1) <= 0){
      current = current - 1 || 1
    }
    return current
  }

  /**
   * @desc 批量删除
   */
  deletePeopleBatch = () => {
    const { checkList } = this.state;
    const { deletePeopleBatch, libDetail} = this.props;
    if(!checkList.length){
      return message.error('请选择要删除的人员')
    }
    deletePeopleBatch(checkList, libDetail.id, () => {
      let current = this.resetCurrent()
      this.setState({
        checkList: [],
        current
      })
    })
  }

  /**
   * @desc 单个删除
   */
  deleteItem = (v, id) => {
    const { deleteLibPeople } = this.props;
    deleteLibPeople && deleteLibPeople(v, id, () => {
      let current = this.resetCurrent(true)
      this.setState({
        current
      })
    })
  }

  /**
   * @desc 计算全选半选状态
   */
  computedCheckAllStatus = (listData, checkList) => {
    const checkHalfStatus = checkList.length && listData.length > checkList.length;
    const checkAllStatus = listData.length === checkList.length;
    return {
      checkHalfStatus,
      checkAllStatus
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.libDetail.id !== this.props.libDetail.id && nextProps.deleteCheckable){
      this.setState({
        checkList: [],
        current: 1,
      })
    }
  }
  
  /**
   * @desc 获取展示列表数据
   */
  getListData = (objectMainList) => {
    const { pageSize, current } = this.state;
    const startIdx = pageSize*(current - 1);
    const endIdx = pageSize*current;
    const listData = objectMainList.slice(startIdx, endIdx);
    return listData
  }

  /**
   * @desc 前端分页
   */
  onPaginationChange = (current, pageSize) => {
    this.setState({
      current, pageSize, checkList: []
    })
  }

  render(){
    const { 
      className='', 
      userId,
      libDetail, 
      // deleteLibPeople, 
      editLibPeople, 
      deleteCheckable, // 是否可选中
      beforeUpload,
      uploadDone,
      setSpinning,
      viewRef,
      actionName,
      currentLength, // 已上传图片数量
      libTypeInfo
    } = this.props;
    const { libType, libLabel } = libTypeInfo;
    const objectMainList = libDetail.objectMainList || [];
    const { checkList, current, pageSize } = this.state;
    const listData = this.getListData(objectMainList);
    let subTitle = (
      <span>
        （人员总数：<span className='highlight'>{objectMainList.length}</span> 人）
      </span>
    );
    let checkHalfStatus, checkAllStatus;
    if(deleteCheckable){
      ({checkHalfStatus, checkAllStatus} = this.computedCheckAllStatus(listData, checkList));
      if(checkList.length){
        subTitle = (
          <span>
            （总共：<span className='highlight'>{objectMainList.length}</span> 人　已选：<span className='highlight'>{checkList.length}</span> 人）
          </span>
        );
      }
    }
    return (
      <div className={`monitee-lib-people-wrapper ${className}`}>
        <LibHeader 
          title={`${libLabel}`}
          subTitle={subTitle}
        >
          {!!listData.length && userId === libDetail.creatorId && (
            <AuthComponent actionName={actionName}>
              <div className='people-list-opera'>
                <UploadPeople 
                  libType={libType}
                  currentLength={currentLength}
                  setLoading={setSpinning}
                  libDetail={libDetail}  
                  beforeUpload={beforeUpload}
                  uploadDone={uploadDone}
                  viewRef={viewRef}              
                  label={`添加${libLabel}`}
                  popover={true}
                />
                { deleteCheckable && ([
                  <Checkbox 
                    key='check'
                    onChange={(e) => this.checkAllChange(e, listData)}
                    indeterminate={checkHalfStatus}
                    checked={checkAllStatus}
                  >全选</Checkbox>,
                  <IconSpan 
                    key='delete'
                    className='span-btn'
                    disabled={!checkList.length}
                    icon='icon-Delete_Main' 
                    onClick={this.deletePeopleBatch} 
                    label='批量删除'
                    mode='inline'
                  />
                ])}
              </div>
            </AuthComponent> 
          )}
        </LibHeader>
        <div className={`people-info-container ${!listData.length ? 'no-item' : ''}`}>
          <div className='people-list-container clearfix'>
          {!!listData.length
            ? listData.map(v => (
                <PeopleCard
                  key={v.id}
                  className='fl'
                  item={v}
                  showStatus={true}
                >
                  { userId === libDetail.creatorId && (
                    <AuthComponent actionName={actionName}>
                      <div className='item-children'>
                        <div className='item-opera'>
                          <IconSpan 
                            className='span-btn'
                            onClick={() => editLibPeople(v)}
                            title='编辑'  
                            icon='icon-Edit_Main'
                          />
                          <IconSpan
                            className='span-btn item-delete'
                            onClick={() => this.deleteItem(v, libDetail.id)}
                            title='删除' 
                            icon='icon-Delete_Main'
                          />
                        </div> 
                        {deleteCheckable && (
                          <Checkbox
                            checked={ checkList.indexOf(v.id) > -1 }
                            onChange={(e) => this.checkItemChange(e, v)}
                          />
                        )}
                      </div>
                    </AuthComponent>
                  )}
                </PeopleCard>
              ))
            : userId === libDetail.creatorId 
                ? 
                  <AuthComponent actionName={actionName}>
                    <UploadPeople 
                      libType={libType}
                      libDetail={libDetail}  
                      beforeUpload={beforeUpload}
                      uploadDone={uploadDone}
                      viewRef={viewRef}              
                      label={`添加${libLabel}`}
                    />
                  </AuthComponent>
                : null
          }
          </div>
          <Pagination 
            total={objectMainList.length}
            pageSize={pageSize}
            current={current}
            pageSizeOptions={['12', '24', '36']}
            onChange={this.onPaginationChange}
            simpleMode
          />
        </div>
      </div>
    )
  }
}

export default LibPeople;

