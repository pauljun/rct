import React from 'react';
import './index.less';

const PersonRoom = Loader.loadBusinessComponent('Statistics', 'PersonRoom');

class DetailPersonnelRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }
  componentDidMount() {
    this.getList(this.props.list);
  }

  getList = (list = []) => {
    let aids = [];
    list.map(v => {
      if(v.accoompanyAid) {
        aids.push(v.accoompanyAid);
      }
    });
    if(aids.length > 0 ) {
      Service.person.queryAidsPicture({aids}).then(res => {
        let data = res.data;
        data.map(item => {
          let findIndex = list.findIndex(v => v.accoompanyAid && v.accoompanyAid === item.aid);
          if(findIndex > -1) {
            list[findIndex].portraitPictureUrl = item.newestPictureUrl || item.lastestPictureUrl
          }
        });
        this.setState({
          list
        })
      })
    } else {
      this.setState({
        list
      })
    }
  }
  render() {
    let { data = {}, changeCOllModal } = this.props;
    const { list = [] } = this.state;
    return (
      <div className='detail-personnel-room'>
        <div className="room-header">
          人员关系：
        </div>
        <div className="room-content">
        {list.length > 0 && <PersonRoom changeCOllModal={changeCOllModal} data={data} list={list}/> }
        </div>
      </div>
    );
  }
}

export default DetailPersonnelRoom;