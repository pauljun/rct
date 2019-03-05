import React from 'react'
import { DragSource, DropTarget } from 'react-dnd';

// const DragSource = Loader.loadComponent(
//   "ReactDnD",
//   null,
//   "DragSource"
// )
// const DropTarget = Loader.loadComponent(
//   "ReactDnD",
//   null,
//   "DropTarget"
// )

const style = {
  display: 'block',
  padding: '16px',
  borderRadius: '5px',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
  cursor: 'move'
};
const specTarget = {
  drop(props) {
    return {
      id: props.id,
      index: props.index,
    };
  }
};

const specSource = {
  beginDrag(props) {
    return {
      id: props.id,
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const source = monitor.getItem();
    const target = monitor.getDropResult();

    if (source.id === target.id) {
      return;
    }
    props.moveCard(source.id, target.index);
  }
};

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});
export default DropTarget('box', specTarget, collectTarget)(DragSource('box', specSource,collectSource)(class Card extends React.Component {
  render() {
    const { children, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(React.createElement(
      'div',
      { style: { ...style, opacity } },
      children
    )));
  }
}));
