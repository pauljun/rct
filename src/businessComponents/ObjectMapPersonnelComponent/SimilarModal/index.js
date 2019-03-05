import React from 'react';
import './index.less';
const ModalComponent = Loader.loadBaseComponent('ModalComponent');
const Similar = Loader.loadBaseComponent('Card', 'Similar');

class SimilarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choseList: [],
      SimilarList: [],
      personId: undefined
    };
  }

  componentDidMount() {
    if(this.props.data) {
      this.querySimilarVids(this.props.data.personId || this.props.data.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.querySimilarVids(nextProps.data.personId||nextProps.data.id);
    }
  }

  querySimilarVids = personId => {
    Service.person.querySimilarVids({ personId }).then(res => {
      const data = res.data;
      let aids = [],
        choseList = [];
      data.map(v => aids.push(v.aid));
      if (aids.length > 0) {
        Service.person.queryAidsPicture({ aids }).then(item => {
          data.map((v, index) => {
            item.data.map(k => {
              if (k.aid === v.aid) {
                if (k.newestPictureUrl) {
                  v.imgUrl = k.newestPictureUrl;
                } else {
                  v.imgUrl = k.lastestPictureUrl;
                }
              }
            });
            if (v.type === 2) {
              v.checked = false;
            } else {
              v.checked = true;
              choseList.push({ 
                peopleId: personId, 
                aid: v.aid,
                aidUrl: v.imgUrl,
                similarity: v.score,
                type: 1
              });
            }
          });
          this.setState({
            SimilarList: data,
            personId,
            choseList,
          });
        });
      } else {
        this.setState({
          SimilarList: [],
          choseList: [],
          personId
        });
      }
    });
  };

  onClick = (type, data) => {
    let { SimilarList, personId } = this.state;
    let findSimlar = SimilarList.findIndex(v => v.aid === data.aid);
    if (findSimlar > -1) {
      SimilarList[findSimlar].checked = type;
    }
    let aids = [];
    SimilarList.map(v => {
      if (v.checked === true) {
        aids.push({ 
          peopleId: personId, 
          aid: v.aid,
          aidUrl: v.imgUrl,
          similarity: v.score,
          type: 1
        });
      }
    });
    this.setState({
      choseList: aids,
      SimilarList
    });
  };

  onOk = () => {
    const { choseList } = this.state;
    this.props.onOk && this.props.onOk(choseList);
  };
  render() {
    const { onCancel, visible } = this.props;
    let { SimilarList } = this.state;
    return (
      <ModalComponent
        className="personnel-simila-modal"
        visible={visible}
        onOk={this.onOk}
        onCancel={() => onCancel && onCancel()}
        width="860px"
        title="相似人员推荐">
        <div className="simila-content">
          {SimilarList.map(item => {
            return (
              <Similar
                onClick={this.onClick}
                data={item}
                imgUrl={item.imgUrl}
              />
            );
          })}
          <div className="null-card" />
          <div className="null-card" />
          <div className="null-card" />
          <div className="null-card" />
        </div>
      </ModalComponent>
    );
  }
}

export default SimilarModal;
