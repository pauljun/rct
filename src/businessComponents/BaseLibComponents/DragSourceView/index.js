/**
 * @author wwj
 * @createTime 2019-1-7
 */

import React from 'react'

const boxSource = {
	beginDrag(props) {
		props.beginDrag && props.beginDrag()
		return {}
	},
	endDrag(props, monitor) {
		props.endDrag && props.endDrag()
		if (!monitor.didDrop()) {
			return
		}
	}
}

class View extends React.Component {
	render() {
		const {
			isDragging,
			children,
			connectDragSource,
			canDrag
		} = this.props
		return (
			<div className={`box-item ${!canDrag ? 'not-allow-drap' : ''}`}>
				{
					connectDragSource(
						<div className={isDragging ? 'drop drop-loading' : 'drop'}>
							{children}
						</div>
					)
				}
			</div>
		)
	}
}

export default Loader.loadDecComponent({
	Component: View,
  name: "ReactDnD",
  exportName: "DragSource",
  hasArgs: true,
  args: [
    "box",
    boxSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag()
    })
  ]
})