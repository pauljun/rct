import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');

@Decorator.errorBoundary
@observer
class ObjectMapSex extends Component { 
  render() {
    const { data } = this.props;
    const total = data.reduce((a, b) => a.count + b.count);
    let womanNumber = 0, manNumber = 0;
    data.map(v => {
      if(v.tag === '100001') {
        manNumber = v.count
      }
      if(v.tag === '100002') {
        womanNumber = v.count
      }
    })
    return (
        <div className='object-map-sex'>
          <div className='sex-header'>
            <div className='header'>
            <IconFont type={'icon-Men_Dark'} theme="outlined" />男
            </div>
            <div className='header'>
            <IconFont type={'icon-Women_Dark'} theme="outlined" />女
            </div>
          </div>
          <div className='sex-content'>
            <div className='content-left' style={{width: `${.6 * 280}px`}}>

            </div>
            <div className='content-center' style={{left: `${.6 * 280 - 3}px`}}>

            </div>
            <div className='content-right'>

            </div>
          </div>
          <div className='sex-footer'>
            <div className='footer-left left'>
              <span className='number'>{ (100 * manNumber / total).toFixed(2) }% {manNumber} </span>
            </div>
            <div className='footer-left'>
              <span className='number'>{ (100 * womanNumber / total).toFixed(2) }% {womanNumber}</span>
            </div>
          </div>
        </div>
    )
  }
}

export default ObjectMapSex;