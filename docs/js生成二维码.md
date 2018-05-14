# js生成二维码  

> 通过jquery.qrcode.js插件,在网页上直接生成二维码,而无需依赖后端  

## 引入组件  

1. jquery  

版本不确定
`https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js` 

2. jquery.qrcode.js  

版本 1.0  
`https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js`  

## 兼容中文的方法  

中文需要先将字符转换成utf8编码,然后再生成。  

```
    	function toUtf8(str) {    
	        var out, i, len, c;    
	        out = "";    
	        len = str.length;    
	        for(i = 0; i < len; i++) {    
	            c = str.charCodeAt(i);    
	            if ((c >= 0x0001) && (c <= 0x007F)) {    
	                out += str.charAt(i);    
	            } else if (c > 0x07FF) {    
	                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
	                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
	                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
	            } else {    
	                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
	                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
	            }    
	        }    
	        return out;    
	    } 
```

## jquery.qrcode.js的使用  

```
// 常规方法
$('#qrcode').qrcode(val);

// 在目标元素中追加一个二维码图片,二维码的宽高均为400,内容为val
$('#qrcode').qrcode({width: 400,height: 400,text: val});
```

