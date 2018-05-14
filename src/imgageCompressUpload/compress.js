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

    function DdvCompress(opt) {
        this._initial(opt);
    }
    DdvCompress.prototype = {
        constructor: this,
        _initial: function(opt) {
            // 默认参数
            var def = {
                url: false,
                // 上传表单文件名称
                formName: 'image',
                domFile: '',
                domOrigin: '',
                domCompress: '',
                debug: false,
                // 压缩比率
                qualitity: 0.4,
                // 是否返回blob对象
                returnType: 'file',
                // 超过1M的图片就要压缩  1048576
                maxSize: 1,
                ext: [''],
                uploadCallback: function(res) {
                    // 在这里执行上传回调
                    console.log(res);
                }
            };
            // 替换默认参数
            this.opt = extend(def, opt, true);
        },
    };
    /**
     * 压缩图片 传入的是base64字符串
     * @param {string} data 
     */
    DdvCompress.prototype.compress = function(data) {
        var _this = this;
        var img = new Image();
        img.src = data;
        img.onload = function() {
            // 默认按比例压缩 这里修改宽高
            var w = this.width,
                h = this.height,
                scale = w / h;
            w = _this.opt.width || w;
            h = _this.opt.height || (w / scale);
            var quality = 0.4; // 默认图片质量为0.4
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
            ctx.drawImage(this, 0, 0, w, h);
            // 图像质量
            if (_this.opt.quality && _this.opt.quality <= 1 && _this.opt.quality > 0) {
                quality = _this.opt.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var returnData = canvas.toDataURL(_this.fileinfo.type, quality);
            // var base64 = canvas.toDataURL('image/png', quality);
            _this.compressSuccess(returnData);
        }
    };
    /**
     * 压缩成功后执行的回调函数
     * @param {string} returnData 
     */
    DdvCompress.prototype.compressSuccess = function(returnData) {
        if (this.opt.domCompress) {
            // 预览压缩后的图片
            this.prevCompress(returnData);
        }
        if (this.opt.returnType == 'base64') {
            // console.log('base64');
        } else if (this.opt.returnType == 'blob') {
            returnData = this.base64ToBlob(returnData);
        } else if (this.opt.returnType == 'file') {
            returnData = this.base64ToFile(returnData);
        }
        if (this.opt.url) {
            // 若配置了上传url,则自动上传
            var data = new FormData();
            data.append(this.opt.formName, returnData);
            this.post(data, this.opt.url);
        }
    };
    /**
     * 出错时的提示函数 
     * @param {string} e 
     */
    DdvCompress.prototype.error = function(e) {
        alert(e);
    };
    /**
     * 设置默认配置
     * @param {object} opt 
     */
    DdvCompress.prototype.option = function(opt) {
        this.opt = extend(this.opt, opt, true);
    };
    /**
     * 文件对象 document.getElementById('file').files[0]
     * @param {file} file 
     */
    DdvCompress.prototype.fileToBase64 = function(file) {
        if (!file) {
            return false;
        }
        var _this = this;
        this.fileinfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
        };
        if (1) {
            var data = new FormData();
            data.append('image', file);
            this.post(data, this.opt.url);
        }
        var ready = new FileReader();
        ready.onload = function() {
            // 执行成功回调
            _this.toBase64Success(this.result);
        }
        ready.readAsDataURL(file);
    };
    /**
     * base64图片
     * @param {stirng} base64 
     */
    DdvCompress.prototype.toBase64Success = function(base64) {
        if (this.opt.domOrigin) {
            // 预览压缩前的图片
            this.prevOrigin(base64);
        }
        if (this.fileinfo.size > this.opt.maxSize) {
            // 过大的图片进行压缩
            this.compress(base64);
        } else {
            // 不超过指定大小的图片直接进入成功方法
            this.compressSuccess(base64);
        }
    }
    /**
     * base64转出blob
     * @param {string} base64 
     */
    DdvCompress.prototype.base64ToBlob = function(base64) {
        var arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        this.fileinfo.type == mime;
        // var info = {type:mime,name:this.filename,type:this.filetype};
        return new Blob([u8arr], this.fileinfo);
    };
    /**
     * base64转出file
     * @param {string} base64 
     */
    DdvCompress.prototype.base64ToFile = function(base64) {
        var arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        this.fileinfo.type == mime;
        // var info = {type:mime,name:this.filename,type:this.filetype};
        return new File([u8arr], this.fileinfo.name, this.fileinfo);
    };
    DdvCompress.prototype.prevOrigin = function(base64) {
        document.getElementById(this.opt.domOrigin).src = base64;
    };
    DdvCompress.prototype.prevCompress = function(base64) {
        document.getElementById(this.opt.domCompress).src = base64;
    }
    DdvCompress.prototype.post = function(data, url) {
        var _this = this;
        if (!data) {
            this.error('上传内容不能为空');
            return false;
        }
        if (!url) {
            this.error('请传入上传url');
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // 304未修改
                    if (_this.opt.uploadCallback && typeof(_this.opt.uploadCallback) === 'function') {
                        _this.opt.uploadCallback(xhr.responseText);
                    }
                } else if (xhr.status == 500) {
                    _this.error('服务器出错了');
                }
            }
        };
        xhr.send(data);
    }
    // 最后将插件对象暴露给全局对象
    _global = (function() {
        return this || (0, eval)('this');
    }());
    !('DdvCompress' in _global) && (_global.DdvCompress = DdvCompress);
    // 我只是给浏览器用的
    // _global = (function(){ return this || (0, eval)('this'); }());
    // if (typeof module !== "undefined" && module.exports) {
    //     module.exports = ddvCompress;
    // } else if (typeof define === "function" && define.amd) {
    //     define(function(){return ddvCompress;});
    // } else {
    //     !('ddvCompress' in _global) && (_global.ddvCompress = ddvCompress);
    // }
}());