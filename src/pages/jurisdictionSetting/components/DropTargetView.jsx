import React from "react";

const drapEvent = {
  canDrop(props) {
    if (props.current === 2 || props.current === 5) {
      if (props.dropId === 3 || props.dropId === 6) {
        return true;
      }
      return false;
    } else {
      if (props.dropId !== 3 && props.dropId !== 6) {
        return true;
      }
      return false;
    }
  },
  drop(props) {
    props.onDrop(props.current);
  }
};

class View extends React.Component {
  render() {
    const { connectDropTarget, canDrop, isOver } = this.props;
    let className = "";
    if (!canDrop) {
      className = "no-drop";
    }
    if (canDrop && isOver) {
      className = "is-over";
    }
    return (
      // <div>
      <div className={className}>{connectDropTarget(this.props.children)}</div>
    );
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
});
