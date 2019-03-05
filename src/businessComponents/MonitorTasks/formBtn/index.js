// 表单数据提交和取消按钮
import React from 'react'
import { Button } from 'antd'
import './index.less'
const FormBtn = (props) => {
  return (
    <div className={`form-btn-message ${props.className}`}>
      <Button className="btn-cancle btn" onClick={props.cancleSubmit.bind(this,props.index)}>取消</Button>
      <Button type='primary' className="btn-sure btn" onClick={props.toSubmit}>确定</Button>
    </div>
  )
}
export default FormBtn