import React from 'react';
//import './index.less'

const InfiniteScrollLayout = Loader.loadBaseComponent(
  'InfiniteScrollLayout'
);
const CommunityCard=Loader.loadBusinessComponent('Card','CommunityCard')
@Decorator.businessProvider('device')
class Test extends React.Component {
 constructor(props){
   super(props);
   this.outheightref=React.createRef();
   this.state={
    mesList:[],
    total:0,
   }
   this.searchOptions={
    collectionType: 0,
    faceFeature: "",
    focusType: null,
    fuzzyContent: "",
    page: 1,
    pageSize: 20,
    peroidType: 0,
    sortType: 0,
    tagCodes: [],
   }
 }
 /**原生监听页面滚动高度 */
 componentWillMount() {
  window.addEventListener(
    'scroll',
    this.handleBackTop,
    true
  );
}
handleBackTop = () => {
  //debugger
}
  componentDidMount(){
    Service.community.getListPersonalInformation(this.searchOptions).then(res => {
        this.setState({
          mesList:res.list,
          total:res.total
        })
      })
  }
  loadMore = page => {
    let {mesList,total}=this.state;
    if(mesList.length>total){
      this.setState({
        mesList:mesList.slice(0,total)
      })
    }
    this.searchOptions.page++
    Service.community.getListPersonalInformation(this.searchOptions).then(res => {
      this.setState({
        mesList:mesList.concat(res.list)
      })
    })
  };
  render() {
    let {total,mesList}=this.state;
    return (
      <div style={{height:"100%",width:'100%'}} ref={this.outheightref}>
      <InfiniteScrollLayout
        count={total}
        rowSize={5}
        itemWidth={350}
        itemHeight={310}
        height={document.getElementsByTagName('div')[0].clientHeight-60}
        data={mesList}
        loadMore={this.loadMore}
        renderItem={(item, index) => <CommunityCard data={item} key={index}/>}
      />
      </div>
    );
  }
}

export default Test;
