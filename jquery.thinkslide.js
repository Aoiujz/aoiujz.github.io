/**
 +-------------------------------------------------------------------
 * jQuery thinkslide - 幻灯片插件 - http://zjzit.cn/thinkslide
 +-------------------------------------------------------------------
 * @version    1.0.0 beta1
 * @since      2013.04.04
 * @author     麦当苗儿 <zuojiazi.cn@gmail.com> <http://www.zjzit.cn>
 * @github     https://github.com/Aoiujz/thinkslide.git
 +-------------------------------------------------------------------
 */
(function(){
var 
	/* 当前脚本文件名 */
    __FILE__ = $("script").last().attr("src"),

    /* ThinkSlide 幻灯片对象 */
    ThinkSlide,

    /* 默认配置项 */
    defaults = {
    	"style" : "default"
    };

//加载指定的CSS文件
function includeCss(css, onload){
    var index = __FILE__.lastIndexOf("/"), 
        path = (index == -1) ? '' : __FILE__.slice(0, index) + '/'; 

    //检测是否已经加载了css
    if($("link[href='" + path + css + "']").length){
        onload();
        return;
    };

    //加载CSS文件
    $("<link/>")
        .load(onload)
        .attr({
            "href" : path + css,
            "type" : "text/css", 
            "rel"  : "stylesheet"
        }).appendTo("head");
}

function wrapItem(){
    var wrap = $("<div class=\"thinkslide-wrap\"></div>");
    wrap.css({
        "position" : "relative",
        "overflow" : "hidden",
        "width"    : this.options.width,
        "height"   : this.options.height
    });

    this.box.wrapInner(wrap);
}

function createToolsBar(){
    var tools = $("<div class=\"thinkslide-tools\"></div>"),
        dot   = $("<div class=\"thinkslide-dot\"></div>");

    //创建按钮
    for(var i = this.item.length; i > 0; i--){
        dot.prepend("<span>" + i + "</span>")
    }

    this.box.append(tools.append(dot));
}

/**
 * 构造方法，用于实例化一个新的幻灯片对象
 +----------------------------------------------------------
 * element 幻灯片内容元素
 * options 幻灯片选项
 +----------------------------------------------------------
 */
ThinkSlide = function(element, options){
    var self = this;

    //合并配置选项
    options  = $.extend({}, defaults, options || {});

    this.box     = $(element);
    this.options = options;
    this.item    = this.box.children().css("z-index", 0);
    this.current = this.item.eq(0).css("z-index", 1);

    //自动获取宽度和高度
    if(!options.width)  options.width  = this.box.width();
    if(!options.height) options.height = this.box.height();

    //添加皮肤样式名
    this.box.addClass('thinkslide-' + options.style).css("position", "relative");
    this.item.addClass("thinkslide-item").css("position", "absolute");

    //加载CSS文件，完成后创建幻灯片
    includeCss("skin/" + options.style + "/style.css", function(){
        //包裹幻灯片元素
        wrapItem.call(self);

        //创建工具栏
        createToolsBar.call(self);

        setInterval(function(){self.next()}, 5000);
    });
}

ThinkSlide.prototype = {
    /* 显示下一张幻灯片 */
    "next" : function(){
        var next = this.current.next();
        this.show(next.length && next);
    },

    /* 显示指定索引的幻灯片 */
    "show" : function(index){
        var self = this, current = $.isNumeric(index) ? this.item.eq(index) : index;
        // this.current.css("z-index", 1).animate({"left" : 0 - this.options.width}, 1000);
        // current.css({
        //     "left"    : this.options.width,
        //     "z-index" : 2
        // })
        // .animate({"left" : 0}, 1000, function(){
        //     self.current.css("z-index", 0);
        //     self.current = current;
        // });
        
        this.current.css("z-index", 1);
        current.css({"z-index" : 2, "opacity" : 0})
        .animate({"opacity" : 1}, 1000, function(){
            self.current.css("z-index", 0);
            self.current = current;
        })

    }
}

/**
 * jquery thinkslide 插件方法  
 * @param  {object} opt 配置项
 * @return {object}     jquery DOM对象
 */
$.fn.thinkslide = function(opt){
    return this.each(function(){
        new ThinkSlide(this, opt);
    });
}
	
})(jQuery);