import React from "react";

const ChartCard = Loader.loadBusinessComponent('Statistics','ChartCard');
const boxSource = {
  beginDrag(props) {
    props.beginDrag();
    return {};
  },
  endDrag(props, monitor) {
    props.endDrag();
    if (!monitor.didDrop()) {
      return;
    }
  },
  canDrag(props) {
    return props.isAllowDrap;
  }
};

class View extends React.Component {
  render() {
    const {
      isDragging,
      children,
      connectDragSource,
      title,
      canDrag
    } = this.props;
    return (
      <div className={`item ${!canDrag ? "not-allow-drap" : ""}`}>
        {connectDragSource(
          <div className={isDragging ? "drop drop-loading" : "drop"}>
            <ChartCard title={title} type="charts">
              {children}
            </ChartCard>
          </div>
        )}
      </div>
    );
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
});
