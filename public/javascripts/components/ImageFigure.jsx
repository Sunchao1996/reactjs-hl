import React from 'react';
class ImageFigure extends React.Component {
    //imgFigure的点击处理函数
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        var styleObj = {};
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            //为了兼容不同浏览器，为css样式key值加上浏览器厂商前缀
            /*(['-moz-','-ms-','-webkit-','']).forEach(function(value){
                styleObj[value+'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
            }.bind(this));本该写法，但是应该使用驼峰写法*/
            (['MozTransform','msTransform','WebkitTransform','']).forEach(function(value){
             styleObj[value+'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
             }.bind(this));
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }
        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ?' is-inverse':'';
        return (
            <figure style={styleObj} className={imgFigureClassName} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back">
                        <p>

                            {this.props.data.desc}
                        </p>

                    </div>
                </figcaption>
            </figure>
        );
    }
}
export {ImageFigure as default}