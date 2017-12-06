import React from 'react';
import ReactDOM from 'react-dom';
import imageDatas from '../../../data/imageDatas.json';
import ImageFigure from '../../components/ImageFigure';
import ControllerUnit from '../../components/ControllerUnit';
var imageDataArr = [...imageDatas];
//利用自执行函数，将图片信息转换成图片URL路径信息
imageDataArr = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../../../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDataArr);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: [
                /*
                 * {pos:{left:'0',top:'0'}},rotate:0,//旋转角度isInverse:false//图片正反面isCenter:false//图片是否居中
                 * */
            ]
        }
        this.imageFigure = [];
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {
                topY: [0, 0],
                x: [0, 0]
            }
        }
        this.rearrang.bind(this);
        this.getRangeRandom.bind(this);
    }

    //获取区间内的随机值
    getRangeRandom(low, high) {
        return Math.ceil(Math.random() * (high - low) + low);
    }

    //获取0~30度之间的任意正负值
    get30DegRandom() {
        return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
    }

    //翻转图片 输入当期那别执行inverse操作的图片对应的图片信息数组的index值
    inverse(index) {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
            console.log(this.state);
        }.bind(this);
    }


    //利用rearrange函数，居中对应index的图片
    center(index) {
        return function () {
            this.rearrang(index);
        }.bind(this);
    }

    //重新布局所有图片 centerIndex中心位置图片
    rearrang(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x;

        var imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),//上侧图片，取一个或者两个
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //居中的centerIndex图片不需要旋转
        imgsArrangeCenterArr[0].rotate = 0;
        imgsArrangeCenterArr[0].isCenter = true;

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: this.get30DegRandom(),
                isCenter: false
            }
        }.bind(this));

        //布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;
            //前半部分布局在左边，后半部分布局在右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i].pos = {
                top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            }
            imgsArrangeArr[i].rotate = this.get30DegRandom();
            imgsArrangeArr[i].isCenter = false;
        }



        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    //组件加载之后定位每张图片的位置
    componentDidMount() {
        var stageDOM = this.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        console.log(stageW, stageH, halfStageW, halfStageH);
        var imgFigureDOM = ReactDOM.findDOMNode(this.imageFigure[0]),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        console.log(imgW, imgH, halfImgW, halfImgH);
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        console.log(this.Constant);
        //计算左侧，右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgH;
        this.Constant.vPosRange.x[1] = halfStageW;
        console.log(this.Constant)
        this.rearrang(0);

    }

    render() {
        var imageFigures = [];
        var controllerUnits = [];
        imageDataArr.forEach(function (value, index) {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imageFigures.push(<ImageFigure key={index} data={value}
                                           ref={(e) => {
                                               this.imageFigure[index] = e
                                           }}
                                           arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)}
                                           center={this.center(index)}/>);
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                                 inverse={this.inverse(index)}
                                                 center={this.center(index)}/>);
        }.bind(this));
        return (
            <section className='stage' ref={(e) => this.stage = e}>
                <section className='img-sec'>
                    {imageFigures}
                </section>
                <nav className='controller-nav'>
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}
export {App as default}
