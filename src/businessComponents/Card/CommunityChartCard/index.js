import React from "react";
import "./index.less";
const CommunityResourceChart = Loader.loadBusinessComponent(
  "Statistics",
  "CommunityResourceChart"
);
export default class CommunityChartCard extends React.Component {
  render() {
    const { title, myColor, data, filterData,resource } = this.props;
    return (
      <div className="community-chart">
        <div className="chart-title">{title}</div>
        <div className="chart-mes-show">
          <div className="chart-show">
            <CommunityResourceChart
              title={title}
              myColor={myColor}
              data={data}
              filterData={filterData}
              resource={resource}
            />
          </div>
          <div className="mes-show" />
        </div>
      </div>
    );
  }
}
