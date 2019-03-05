import React from 'react'

const TrajectoryMap = Loader.loadBusinessComponent('MapComponent', 'TrajectoryMap')

class view extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

  initData = () => {
    const list = this.props.list.sort((a, b) => a.captureTime - b.captureTime)
    let arr = []
    list.map(v => (
      arr.push({
        captureTime: v.captureTime,
        cameraId: v.cid,
        position: [v.longitude, v.latitude],
        deviceName: v.deviceName,
        title: v.deviceName,
        url: v[`${this.props.type}Url`]
      })
    ))
    return arr
  }

  init = trajectory => {
    this.trajectory = trajectory;
    this.trajectory.setData(this.initData())
  };

  onClickCard = (data) => {
    console.log(data);
  }

  render() {
    const data = this.initData();
    return (
      <div className="trajectory-map">
        <TrajectoryMap
          onClickCard={this.onClickCard}
          init={this.init}
          data={data}
        />
      </div>
    )
  }
}

export default view
