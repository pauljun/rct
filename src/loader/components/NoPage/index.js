import React from 'react'
import Page404 from '../NoData/img/404.png'
import 'src/assets/style/components/noPage.less';

class NoPage extends React.Component {
  render() {
    return <div className='has-not-data-box-container'>
      <img src={Page404} alt=""/> 
      {/* <p>404</p> */}
      <div className="has-not-titlt">{'你打开的页面出错了！'}</div>
    </div>
  }
}
export default NoPage
