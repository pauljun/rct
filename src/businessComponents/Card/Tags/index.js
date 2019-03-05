import React from "react";

const Chart = Loader.loadBusinessComponent("Statistics", "Tags");

export default ({ title,singleTag,icon,myColor=['#FFAA00','#8899BB','#A3B8DC','#cccccc'],data=[] }) => (
  <div className="tag-box">
    <div className="label">{title}</div>
    <div className='box-content'>
      <Chart data={data} myColor={myColor} icon={icon} singleTag={singleTag}/>
    </div>
    <style jsx>{`
      .tag-box {
        display:inline-block;
        width: 196px;
        padding:0 16px;
      }
      .box-content {
        width: 102px;
        margin: 0 auto;
      }
      .label{
        color:#666;
        font-size:14px;
        text-align:center;
        padding:16px 0;
      }
    `}</style>
  </div>
);
