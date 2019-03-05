/*
 * @Author: hjj 
 * @Date: 2019-01-22 10:36:55 
 * @Last Modified by: welson
 * @Last Modified time: 2019-01-24 17:26:13
 */

/** 
 *  @desc DOM跟随鼠标位置
 *  @params {string}    className   组件外层类名
 *  @params {boolean}   disabled  是否禁用拖动
 *  @params {object:{width,height}}   size  容器的宽高
 *  @params {function}    getContainer  获取整个容器
 *  @params {ReactElement}    moveBar 可拖动区域, 默认整个容器可拖动，
 *                            传入组件时， 仅moveBar可拖动
 *  @params {ReactElement}    children  接受子组件
 */
import React from 'react';
import addEventListener from 'add-dom-event-listener';

export default class MoveContentView extends React.Component {
  constructor(props) {
    super(props);
    this.isDrag = false;
    this.dragRef = React.createRef();
    this.position = {
      x: 0,
      y: 0
    };
    this.moveEvents = [];
    this.deviation = {
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.updatePosition({ x: 0, y: 0 });
    this.initDomInfo();
    this.props.getContainer && this.props.getContainer(this.dragRef.current)
  }
  initDomInfo(info) {
    const offset = Utils.getPosition(this.dragRef.current);
    const size = this.dragRef.current.getBoundingClientRect();
    this.deviation = {
      offsetX: offset.left,
      offsetY: offset.top,
      width: info ? info.width : size.width,
      height: info ? info.height : size.height
    };
  }
  componentWillUnmount() {
    this.removeMoveEvent();
    this.isDrag = null;
    this.dragRef = null;
    this.moveEvents = null;
    this.deviation = null;
    this.moveEvents = null;
  }

  bindMoveEvent() {
    this.moveEvents = [
      addEventListener(document.body, 'mousemove', this.onMouseMove),
      addEventListener(document.body, 'mouseup', this.onMouseUp)
    ];
  }
  removeMoveEvent() {
    this.moveEvents && this.moveEvents.forEach(
      v => { v.remove && v.remove();}
    );
    this.moveEvents = [];
  }
  onMouseMove = event => {
    if (this.isDrag) {
      let maxX, maxY, moveX, moveY;
      const { x, y } = this.getMouseXY(event);
      moveX = x - this.deviation.offsetX;
      moveY = y - this.deviation.offsetY;

      // 计算可移动位置的大小， 保证元素不会超过可移动范围
      maxX = document.documentElement.clientWidth - this.deviation.width;
      maxY = document.documentElement.clientHeight - this.deviation.height;

      // min方法保证不会超过右边界，max保证不会超过左边界
      // moveX = Math.min(Math.max(0, moveX), maxX);
      // moveY = Math.min(Math.max(0, moveY), maxY);
      const position = {
        x: moveX,
        y: moveY
      };
      if (this.props.onDrag) {
        this.props.onDrag(event, position);
      } else {
        this.updatePosition(position);
      }
    }
  };
  updatePosition = ({ x, y }) => {
    this.position = { x, y };
    this.forceUpdate();
  };

  updateSize = ({ width, height }) => {
    this.initDomInfo({ width, height });
  };
  onMouseUp = event => {
    this.isDrag = false;
    this.removeMoveEvent();
    if (this.props.onDragEnd) {
      this.props.onDragEnd(event, this.position);
    }
  };
  onMouseDown(event) {
    const { x, y } = this.getMouseXY(event.nativeEvent);
    this.deviation.offsetX = x - this.position.x;
    this.deviation.offsetY = y - this.position.y;
    this.isDrag = true;
    this.bindMoveEvent();
  }
  // 函数用于获取鼠标的位置
  getMouseXY(e) {
    let x = 0,
      y = 0;
    e = e || window.event;

    if (e.pageX) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
      y = e.clientY + document.body.scrollTop - document.body.clientTop;
    }

    return { x, y };
  }
  render() {
    let x, y;
    if (this.props.onDrag) {
      x = this.props.position.x;
      y = this.props.position.y;
    } else {
      x = this.position.x;
      y = this.position.y;
    }
    const { 
      className, 
      disabled = false, 
      size = { width: '100%', height: '100%' },
      moveBar = null,
      children = null
    } = this.props;
    return (
      <div
        ref={this.dragRef}
        className={`drag-move-content ${className ? className : ''}`}
        style={{
          transform: `translate(${x}px,${y}px)`,
          width: size.width,
          height: size.height
        }}
        onMouseDown={
          moveBar 
            ? () => null
            : event => !disabled && this.onMouseDown(event)
        }
      >
        { moveBar && (
          <div
            className='move-bar'
            onMouseDown={event => !disabled && this.onMouseDown(event)}
          >
            { moveBar }
          </div>
        )}
        { children }
      </div>
    );
  }
}
