import React from 'react'
import { Radio } from 'antd'
import './index.less'

const IconFont = Loader.loadBaseComponent('IconFont')
const RadioGroup = Radio.Group
class RadioGroupView extends React.Component {
  /**选择 */
  change = e => {
    const { change, name, data } = this.props
    if(e.target.value){
      change({[name]: e.target.value})
    }else{
      change({
        [name]: ''
      })
    }
  }
  render(){
    const { label = '标题', iconFont, data, value = '' } = this.props
    return (
      <div className='radio-group-wrapper'>
        <div className='search-title'>
          {iconFont && <IconFont 
            type={iconFont}
            className="data-repository-icon"/>}
          {label}：
        </div> 
        <div className='search-content'>
          {data && 
            <RadioGroup 
              onChange={this.change} 
              value={value===null ? '': value}
              className='clearfix'
            >
            <Radio value='' key='-1'><span title='全部'>全部</span></Radio>
            {
              data.map(v => {
                return <Radio value={v.value || ''} key={v.value}><span title={v.label}>{v.label}</span></Radio>
              })
            }
          </RadioGroup>}
        </div>
      </div>
    )
  }
}

export default RadioGroupView