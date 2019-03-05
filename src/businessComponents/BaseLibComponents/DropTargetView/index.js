/**
 * @author wwj
 * @createTime 2019-1-7
 */

import React from 'react'

const drapEvent = {
  drop(props){
    props.onDrop && props.onDrop(props.current)
  }
}

class View extends React.Component{
  render(){
    const {
      connectDropTarget,
      canDrop,
      isOver
    } = this.props
    let className = ''
    if(!canDrop){
      className = 'no-drop'
    }
    if(canDrop && isOver){
      className='is-over'
    }
    return (
      <div className={className}>
        {connectDropTarget(this.props.children)}
      </div>
    )
  }
}

export default Loader.loadDecComponent({
  Component: View,
  name: "ReactDnD",
  exportName: "DropTarget",
  hasArgs: true,
  args: [
    "box",
    drapEvent,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      canDrop: !!monitor.canDrop(),
      isOver: monitor.isOver()
    })
  ]
})