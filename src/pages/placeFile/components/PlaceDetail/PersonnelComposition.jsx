import React from 'react';
import { withRouter } from "react-router-dom";
import {Button} from 'antd'
const IconFont = Loader.loadBaseComponent("IconFont");
const InfoIconItemView = Loader.loadBusinessComponent("InfoIconItemView");
const FrameCard = Loader.loadBusinessComponent("FrameCard");
@withRouter
@Decorator.businessProvider('tab')
class PersonnelComposition extends React.Component {
  goPage = (moduleName, data) => {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      data,
      isUpdate: false
    });
  };
  goPersonnelCompositionView = () => {
    this.goPage("personnelCompositionAnalysis", { id: this.props.placeId });
  }
  render() {
    let {personnelNum} = this.props
    return <FrameCard 
        title="人员组成分析："
      headerOperator={this.props.placeId&&<Button className='view-detail-btn' onClick={this.goPersonnelCompositionView}>查看详情<IconFont type="icon-Place_Dark" /></Button>}
      >
        <div className="personnel-composition-view">
          <InfoIconItemView title={"最常出现人员"} icon={"icon-People_Dark"} num={personnelNum.frequentPersonnelNum} />
          <InfoIconItemView title={"临时出现人员"} icon={"icon-Temporary_Dark"} num={personnelNum.temporaryPersonnelNum} />
          <InfoIconItemView title={"长期未出现人员"} icon={"icon-NotAppearing_Dark"} num={personnelNum.unFrequentPersonnelNum} />
          
        </div>
      </FrameCard>; 
  }
}

export default PersonnelComposition