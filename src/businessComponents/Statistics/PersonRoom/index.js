/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';

const EchartsReact = Loader.loadModuleComponent('EchartsReact', 'default');

let options = {
  tooltip: {
    formatter: function(x) {
      return x.data.des;
    }
  },
  series: [
    {
      type: 'graph',
      layout: 'force',
      symbolSize: 80,
      roam: true,
      edgeSymbol: ['circle', 'arrow'],
      draggable: true,
      edgeSymbolSize: [4, 10],
      cursor: 'pointer',
      force: {
        repulsion: 2500,
        edgeLength: [100, 250]
      },
      itemStyle: {
        normal: {
          shadowColor: 'rgba(80,233,178, 0.5)',
          shadowBlur: 10,
          fontSize: 16
        }
      },
      lineStyle: {
        normal: {
          width: 2,
          color: '#50E9B2'
        },
        label: {
          fontSize: 12
        }
      },
      edgeLabel: {
        normal: {
          show: true,
          formatter: function(x) {
            return x.data.name;
          },
          textStyle: {
            fontSize: 12
          }
        }
      },
      label: {
        normal: {
          show: true,
          position: 'bottom',
          textStyle: {
            position: 'bottom',
            fontSize: '12',
            color: '#000'
          }
        }
      },
      data: [],
      links: [
        {
          source: '李达康',
          target: '侯亮平',
          name: '同屋',
          isLabel: true
        },
        {
          source: '李达康',
          target: '祁同伟',
          name: '同屋',
          isLabel: true
        },
        {
          source: '李达康',
          target: '陈岩石',
          name: '同行',
          isLabel: true
        }
      ]
    }
  ]
};

class PersonRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: options
    };
    this.echartRef = React.createRef();
  }
  componentWillMount() {
    this.getOtionTem(this.props.data, this.props.list);
  }

  //定义抠图方法
  async getImgData(imgSrc, color) {
    let img;
    try {
      img = await Utils.loadImage(imgSrc, true);
    } catch (e) {
      img = await Utils.loadImage('/resource/image/AvatarDefault.svg', true);
    } finally {
      return this.canvasImage(img, color);
    }
  }
  canvasImage = (img, color = '#50E9B2') => {
    const canvas = document.createElement('canvas');
    const contex = canvas.getContext('2d');
    let size = 0,
      flag = true;
    if (img.width > img.height) {
      size = img.height + 20;
    } else {
      flag = false;
      size = img.width + 20;
    }
    canvas.width = size + 8;
    canvas.height = size + 8;
    contex.arc(size / 2 + 4, size / 2 + 4, size / 2, 0, 2 * Math.PI); //画出圆;
    contex.clip(); //裁剪上面的圆形
    if (flag) {
      contex.drawImage(
        img,
        0,
        img.height / 2 - size / 2,
        size,
        size,
        4,
        4,
        size,
        size
      ); // 在刚刚裁剪的园上画图
    } else {
      contex.drawImage(
        img,
        img.width / 2 - size / 2,
        0,
        size,
        size,
        4,
        4,
        size,
        size
      ); // 在刚刚裁剪的园上画图
    }
    contex.save();
    contex.beginPath();
    contex.strokeStyle = color;
    contex.lineWidth = 8;
    contex.arc(
      canvas.width / 2,
      canvas.width / 2,
      canvas.width / 2 - 8,
      0,
      2 * Math.PI
    );
    contex.stroke();
    contex.restore();
    contex.strokeStyle = '#fff';
    contex.lineWidth = 4;
    contex.arc(
      canvas.width / 2,
      canvas.width / 2,
      canvas.width / 2 - 10,
      0,
      2 * Math.PI
    );
    contex.stroke();
    return canvas.toDataURL();
  };
  getOtionTem = (option, list) => {
    let data = [];
    let linksArr = [];
    let imgSrcArr = [];
    let newArr = [
      {
        name: option.personName || option.aid,
        symbolSize: 100,
        ...option
      }
    ];
    list.map(v => {
      const items = newArr.filter(v2 => v2.personName === v.personName);
      if (items.length > 0) {
        newArr.push({
          ...v,
          name: `${v.personName || v.accoompanyAid}(${items.length})`
        });
      } else {
        newArr.push({ ...v, name: v.personName || v.accoompanyAid });
      }
    });
    newArr.forEach(v => {
      data.push({ name: v.name });
      imgSrcArr.push(v.portraitPictureUrl);
      linksArr.push({
        source: option.personName || option.aid,
        target: v.name,
        name: v.accoompanyAid ? '同行' : '同屋',
        isLabel: v.accoompanyAid ? true : false,
        personId: v.personId,
        aid: v.accoompanyAid ? v.accoompanyAid : undefined
      });
    });
    let imgPathArr = imgSrcArr.map((v, index) => {
      return Utils.catchPromise(
        this.getImgData(v, index === 0 ? '#ffaa00' : undefined)
      );
    });
    try {
      Promise.all(imgPathArr)
        .then(resArr => {
          resArr.map((path, index) => {
            if (path) {
              data[index].symbol = `image://${path}`;
            }
          });
          options.series[0].data = data;
          options.series[0].links = linksArr;
          this.setState({
            options
          });
        })
        .catch(e => {
        });
    } catch (e) {
      console.error(e);
    }
  };

  onclick = {
    click: this.clickEchartsPie.bind(this)
  };
  clickEchartsPie(e) {
    const { changeCOllModal } = this.props;
    if (e.data.isLabel) {
      changeCOllModal && changeCOllModal(2, e.data);
    } else {
    }
  }
  render() {
    return (
      <div>
        <EchartsReact
          option={this.state.options}
          style={{ height: '530px', width: '100%' }}
          ref={this.echartRef}
          onEvents={{ click: this.clickEchartsPie.bind(this) }}
        />
      </div>
    );
  }
}

export default PersonRoom;
