
/**
 * 编写一个js插件 v1.0
 * @param  {[type]} global    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
;(function(global,undefined) {
    "use strict" //使用js严格模式检查，使语法更规范
    var _global;
    // 对象合并 用户传入参数覆盖默认配置
    function extend(o,n,override) {
        for(var key in n){
            if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
                o[key]=n[key];
            }
        }
        return o;
    }
    
    function MyTest(opt) {
    	// 传入参数
        this._initial(opt);
    }
    MyTest.prototype = {
    	constructor:this
    };
    MyTest.prototype._initial = function (opt) {
		// 默认参数
		var def = {
		   arg1:'1',
		   arg2:'2',
		   arg3:'3',
		   arg4:'4',
		};
		// 替换默认参数
		this.def = extend(def,opt,true);
    };
    MyTest.prototype.start = function () {
    	console.log(this);
    	console.log('start ',this.def);
    }
    

    
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    !('MyTest' in _global) && (_global.MyTest = MyTest);
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