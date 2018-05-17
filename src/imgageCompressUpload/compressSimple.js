;(function canvasDataURL(path, obj){
    
})

/**
 * 图片压缩插件v1.0
 * @param  {[type]} global    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
;
(function(global, undefined) {
    "use strict" //使用js严格模式检查，使语法更规范
    var _global;
    // 对象合并 用户传入参数覆盖默认配置
    function extend(o, n, override) {
        for (var key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key];
            }
        }
        return o;
    }

    function CompressSimple(file,obj) {
        this.compressSuccess = function(){};
        this.compressError = function(){};
        this.compressComplete = function(){};
        try {
            this.toDataURL(file);
        } catch (error) {
            this.compressError(error);
        }finally{
            this.compressComplete();
        }
        return this;
    }
    CompressSimple.prototype.toDataURL = function(file){
        // if(!file){
        //     throw "传入图片不能为空";
        // }
        var _this = this;
        var ready = new FileReader();
        ready.onload = function() {
            // 读取文件后开始压缩
            _this.compress(this.result);
        }
        ready.readAsDataURL(file);				
    }
    CompressSimple.prototype.compress = function(base64,obj){
        var _this = this;
        var img = new Image();
        img.src = base64;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.4;  // 默认图片质量为0.4
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/png', quality);
            // 回调函数返回base64的值
            _this.compressSuccess(base64);
        }
    }
    CompressSimple.prototype.success = function(func){
        this.compressSuccess = func;
    };
    CompressSimple.prototype.error = function(func){
        this.compressError = func;
    };
    CompressSimple.prototype.success = function(func){
        this.compressComplete = func;
    };
    // 最后将插件对象暴露给全局对象
    _global = (function() {
        return this || (0, eval)('this');
    }());
    !('CompressSimple' in _global) && (_global.CompressSimple = CompressSimple);

}());