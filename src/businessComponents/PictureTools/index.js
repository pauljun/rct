import React from 'react';
import { Spin } from 'antd';
import './index.less';

const Loading = Loader.Loading;
const NoData = Loader.NoData;
const IconFont = Loader.loadBaseComponent('IconFont');

const MenuSize = {
  w: 86,
  h: 90
};

class PictureCanvas extends React.Component {
  constructor() {
    super();
    this.cantainerRef = React.createRef();
    this.canvasRef = React.createRef();
    this.sourceData = null;
    this.scaleTimer = null;
    this.drawRectOptions = {
      isOpen: false,
      isStart: false,
      isChange: false
    };
    this.dragOptions = {
      isStart: false
    };
    this.state = {
      isLoaded: false,
      loadError: false,
      showMenu: false,
      menuPosition: {
        x: 0,
        y: 0
      }
    };
    this.options = {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
      scaleTemp: {
        x: 0,
        y: 0
      },
      selectArea: null
    };
    this.position = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      data: { x: 0, y: 0 }
    };
  }

  componentDidMount() {
    const { onInit } = this.props;
    onInit && onInit(this);
    this.reloadPic();
  }
  reloadPic = () => {
    const { imagePath, catchError } = this.props;
    Utils.loadImage(imagePath, true)
      .then(image => {
        this.setState({ isLoaded: true });
        this.sourceData = image;
        const canvas = this.getCanvas();
        const { width, height } = canvas.getBoundingClientRect();
        this.sourceData.width = canvas.width = width;
        this.sourceData.height = canvas.height = height;
        this.drawSourceData();
        canvas.addEventListener('mousedown', this.mouseDown, false);
      })
      .catch(err => {
        console.error(err);
        catchError && catchError();
        this.setState({ loadError: true });
      });
  };
  // 滚轮事件
  handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      this.scale(e.deltaY / 1000);
    }
  };
  bindEvent(flag) {
    const method = flag ? 'addEventListener' : 'removeEventListener';
    document[method]('mousemove', this.mouseMove, false);
    document[method]('mouseup', this.mouseUp, false);
  }

  startScreenshot = () => {
    this.drawRectOptions.isOpen = true;
  };
  cancelScreenshot = () => {
    this.drawRectOptions.isOpen = false;
    this.options.selectArea = null;
    this.state.showMenu && this.setState({ showMenu: false });
    this.drawSourceData();
  };
  getSelectResult = () => {
    if (!this.options.selectArea) {
      return;
    }
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    const imageData = ctx.getImageData(...this.options.selectArea);
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = this.options.selectArea[2] - 2;
    tempCanvas.height = this.options.selectArea[3] - 2;
    tempCtx.putImageData(imageData, -1, -1, 0, 0, canvas.width, canvas.height);
    const dataUrl = tempCanvas.toDataURL();
    tempCanvas.remove();
    tempCtx = null;
    return dataUrl;
  };
  /**
   * 结束绘制
   */
  mouseUp = event => {
    this.position.end = {
      x: event.clientX,
      y: event.clientY
    };
    if (this.drawRectOptions.isOpen) {
      this.drawRectOptions.isStart = false;
      if (this.drawRectOptions.isChange) {
        let position = this.computedMenuPosition();
        this.setState({ showMenu: true, menuPosition: position });
        this.drawRectOptions.isChange = false;
      }
    } else {
      this.dragOptions.isStart = false;
      this.position.data = {
        x: this.position.end.x - this.position.data.x,
        y: this.position.end.y - this.position.data.y
      };
      this.dragCallback();
    }
    this.bindEvent(false);
  };

  computedMenuPosition() {
    const domRect = this.getCanvas().getBoundingClientRect();
    let x, y;
    if (this.position.start.x > this.position.end.x) {
      x = this.position.end.x - MenuSize.w - domRect.x;
      y = this.position.end.y - MenuSize.h - domRect.y;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
    } else {
      x = this.position.end.x - domRect.x;
      y = this.position.end.y - domRect.y;
      if (domRect.width - x < MenuSize.w) {
        x = domRect.width - MenuSize.w;
      }
      if (domRect.height - y < MenuSize.h) {
        y = domRect.height - MenuSize.h;
      }
    }

    return {
      x,
      y
    };
  }

  dragCallback = () => {
    const { scale } = this.options;
    if (scale === 1) {
      this.options.x = 0;
      this.options.y = 0;
      this.drawSourceData();
      return;
    }
    const domRect = this.getCanvas().getBoundingClientRect();
    const w = domRect.width;
    const h = domRect.height;
    const lx = w * (scale - 1);
    const ly = h * (scale - 1);
    let x, y;
    x = this.options.x;
    y = this.options.y;
    if (x > 0) {
      x = 0;
    }
    if (x < -lx) {
      x = -lx;
    }
    if (y > 0) {
      y = 0;
    }
    if (y < -ly) {
      y = -ly;
    }
    if (x !== this.options.x || y !== this.options.y) {
      this.options.x = x;
      this.options.y = y;
      this.drawSourceData();
    }
  };

  /**
   * 开启绘制禁区
   * @param {Event} event
   */
  mouseDown = event => {
    const { allowDrag = true } = this.props;
    this.position.start = {
      x: event.clientX,
      y: event.clientY
    };
    this.position.data = {
      x: event.clientX,
      y: event.clientY
    };
    if (this.drawRectOptions.isOpen) {
      this.dragOptions.isStart = false;
      this.drawRectOptions.isStart = true;
    } else {
      if (!allowDrag) {
        return;
      }
      this.drawRectOptions.isOpen = false;
      this.dragOptions.isStart = true;
    }
    this.bindEvent(true);
  };
  /**
   * 用于绘制禁区储存坐标
   * @param {Event} event
   */
  mouseMove = event => {
    if (this.drawRectOptions.isStart) {
      //TODO 绘制模式
      this.position.end = {
        x: event.clientX,
        y: event.clientY
      };
      this.drawSelectRact({ position: this.position });
      this.drawRectOptions.isChange = true;
      this.state.showMenu && this.setState({ showMenu: false });
    } else {
      //TODO 拖拽模式
      const { clientX, clientY } = event;

      this.position.end = {
        x: clientX,
        y: clientY
      };

      const x = this.position.end.x - this.position.start.x;
      const y = this.position.end.y - this.position.start.y;
      this.options.x += x;
      this.options.y += y;
      this.drawSourceData();
      this.position.start = this.position.end;
    }
  };

  /**
   * 绘制所有对象
   * @param {*} isNewArea
   */
  drawSourceData() {
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    const domRect = this.getCanvas().getBoundingClientRect();
    const { x, y, scale } = this.options;
    canvas.width = domRect.width;
    canvas.height = domRect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, x, y);
    if (typeof this.options.rotate === 'number') {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((this.options.rotate * Math.PI) / 180);
      ctx.drawImage(this.sourceData, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.drawImage(this.sourceData, 0, 0, canvas.width, canvas.height);
    }

    if (this.options.selectArea) {
      ctx.resetTransform();
      let area = this.options.selectArea;
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.strokeRect(...area);
    }
  }
  getCanvas() {
    return this.canvasRef.current;
  }
  getContext() {
    return this.getCanvas().getContext('2d');
  }
  rotate(num) {
    this.options.rotate = parseInt(this.options.rotate + num);
    this.drawSourceData();
    this.forceUpdate();
  }
  scale(num) {
    let flag = false;
    if (this.options.scale + num > 3) {
      this.options.scale = 3;
      flag = true;
    }
    if (this.options.scale + num < 1) {
      this.options.scale = 1;
      flag = true;
    }
    if (!flag) {
      this.options.scale = parseFloat((this.options.scale + num).toFixed(2));
      this.drawScale(this.options.scale, num > 0);
    }
  }
  resetScale() {
    this.options.scale = 1;
    this.options.x = 0;
    this.options.y = 0;
    this.drawSourceData();
    this.props.changeScale && this.props.changeScale(this.options.scale);
  }
  resetRotate() {
    this.options.rotate = 0;
    this.drawSourceData();
  }
  drawScale() {
    const canvas = this.getCanvas();
    const lx = (this.options.scale - 1) * canvas.width;
    const ly = (this.options.scale - 1) * canvas.height;
    this.options.x = lx / -2;
    this.options.y = ly / -2;
    this.drawSourceData();
    this.props.changeScale && this.props.changeScale(this.options.scale);
  }
  drawSelectRact = () => {
    const canvas = this.getCanvas();
    const domRect = canvas.getBoundingClientRect();
    const x = this.position.start.x - domRect.left + 0;
    const y = this.position.start.y - domRect.top + 0;
    const { width, height } = domRect;
    let w = this.position.end.x - this.position.start.x;
    let h = this.position.end.y - this.position.start.y;
    if (w + x > width) {
      w = width - x;
    }
    if (h + y > height) {
      h = height - y;
    }
    this.options.selectArea = [x, y, w, h];

    this.drawSourceData(true);
    this.props.rectChange && this.props.rectChange({ x, y, w, h });
  };
  jumpPage = name => {
    const { beforeJumppage } = this.props;
    let id = Utils.uuid();
    let url = this.getSelectResult();
    if (Utils.isFullscreen(this.cantainerRef.current)) {
      Utils.exitFullscreen();
    }
    LM_DB.add('parameter', { id, url }).then(res => {
      beforeJumppage().then(() => {
        BaseStore.tab.goPage({ moduleName: name, data: { id, isSearch: true, searchType: 1 } });
      });
    });
  };
  render() {
    const { className = '' } = this.props;
    const { isLoaded, loadError, showMenu, menuPosition } = this.state;
    if (loadError) {
      return <NoData />;
    }
    return (
      <Spin spinning={!isLoaded} wrapperClassName="picture-canvas-loading">
        <div className={`picture-canvas ${className}`} ref={this.cantainerRef}>
          <canvas ref={this.canvasRef} onWheel={this.handleWheel} />
          {this.props.children}
          <div className="menu-action-group" style={{ display: showMenu ? 'block' : 'none', left: menuPosition.x, top: menuPosition.y }}>
            <div className="menu-action-item" onClick={() => this.jumpPage('faceLibrary')}>
              <IconFont type="icon-Face_Main2" />
              搜人脸
            </div>
            <div className="menu-action-item" onClick={() => this.jumpPage('bodyLibrary')}>
              <IconFont type="icon-Body_Main2" />
              搜人体
            </div>
            <div className="menu-action-item" onClick={() => this.jumpPage('vehicleLibrary')}>
              <IconFont type="icon-Car_Dark" />
              搜机动车
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default PictureCanvas;
