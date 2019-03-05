import React,{ Component } from 'react'
import { Slider } from 'antd'
import './index.less'
/**
 * @desc onAfterChange可以做节流的功能，但是失去焦点后，
 * onAfterChange会调用一次，导致触发两次查询的结果
 */
class ScoreSlider extends Component {
  state = {
    value: 85
  }
  isOnce = null
  onAfterChange = (value) => {
    if(!this.isOnce){
      return
    }
    this.isOnce = false 
    this.props.change && this.props.change({
      score: value
    })
  }
  onChange = value => {
    this.isOnce = true
    this.setState({
      value
    })
  }
  render(){
    const { value } = this.state
    return (
      <div className='slider-select-tlzj'>
        <div className='slider-label'>相似度 :</div>
        <div className='min'>60</div>
        <Slider
          value={value}
          min={60}
          max={99}
          onAfterChange={this.onAfterChange} 
          onChange={this.onChange}
        />
        <div className='max'>99</div>
      </div>
    )
  }
}

export default ScoreSlider
