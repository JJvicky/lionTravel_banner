(function($) {
  var ModuleName = "banner";

  var Module = function(element, opt) {
    this.ele = element; //element: banner DOM物件
    this.$ele = $(element); //  n.fn 物件
    this.$btn = $(`<div class =${opt.button.class} ></div>`);
    this.$up = $('<i class="fas fa-sort-up"></i>');
    this.$down = $('<i class="fas fa-caret-down"></i>');
    this.option = opt;
    this.$img = $("img");
    this.$wrap = $(".wrap");
    this.opened = opt.class.opened; 
    this.closed = opt.class.closed;
    this.toggleTime; //AutoToggle時判斷傳入true or number

  };

  Module.DEFAULTS = {
    openAtStart: true,
    autoToggle: false, //[boolean|number] true | false | 3000
    button: {
      closeText: "收合", // [string]
      openText: "展開", // [string]
      class: "btn" // [string]
    },
    class: {
      closed: "closed",
      closing: "closing",
      opened: "opened",
      opening: "opening"
    },
    transition: true,
    counter: 1500, //控制transition 必須和CSS中秒數相同  
    whenTransition: function() {
      console.log("whenTransition");
    }
  };
  //開始寫Function
 

  Module.prototype.init = function() {
      
    this.$ele.append(this.$btn); // 1. button初始
     var openAtStart = this.option.openAtStart; //2. 畫面是否先開
    if(this.option.autoToggle === false){  
          //autoToggle :false --> 正常
          console.log("toggle false");
        if (openAtStart){
            this.openedState();
        }else{
            this.closedState();
        }
    }else if(this.option.autoToggle === true){ //autoToggle: true --> 與Atstart相反
        console.log("toggle true");
        if (openAtStart){
            this.closedState();
        }else{
            this.openedState();
        }
    }else{
        if (openAtStart){
            this.openedState();
        }else{
            this.closedState();
        }
        setTimeout(this.toggle.bind(this),this.option.autoToggle);  //autoToggle: number --> trigger click
    }
    if (this.option.transition) {    
        this.addTransition();
      }
  
    }
   
  
  Module.prototype.openedState = function(){
    console.log("heyheyhey");
    this.$btn.text(this.option.button.closeText).append(this.$up); 
    this.$ele.addClass(this.opened);  
    this.$wrap.addClass("opened");
    this.$img.addClass("opened");
  }
  Module.prototype.closedState = function(){
      console.log("catch");
    this.$btn.text(this.option.button.openText).append(this.$down);
    this.$ele.addClass(this.closed);
    this.$img.addClass("closed");
    this.$wrap.addClass("closed");
  }
  Module.prototype.addTransition = function() {    //可以多加!this.$ele.hasClass('transition)
    this.$wrap.addClass("transition");
  };
  
//   Module.prototype.toggle = function(){
//       this.toggleTime = ! isNaN(this.option.autoToggle) ? this.option.autoToggle : 0;
//       console.log(this.option.autoToggle);
      
//       if( isNaN(this.option.autoToggle) === false){   //有數字設定toggle
//           console.log("toggle=number");
//           this.timer_num = setTimeout(this.click.bind(this),this.option.autoToggle);  
//       }else {     //如果是true跑這一行      
//           console.log("toggle = default");
//           this.timer_bln = setTimeout(this.click.bind(this),0); // true > 瞬間開
//       }
//   }
  
  
  Module.prototype.toggle = function() {
     // clearTimeout(this.imgAction);
    if (this.$ele.hasClass(this.opened)) {
      this.close();
    } else if (this.$ele.hasClass(this.closed)) {
      this.open();
    }
    clearInterval(this.timer_num); //執行一次點擊就取消toggle
    clearInterval(this.timer_bln);
    this.Transition();
  };
  Module.prototype.open = function() {
    //需要精簡一下
    this.$wrap.removeClass("closed").addClass("opened");
    this.$btn.text(this.option.button.closeText).append(this.$up);
    this.$img.removeClass("closed").addClass("opened");  // open: 圖先出來
    if (this.option.transition === true) {     
      this.$ele.removeClass(this.closed).addClass(this.option.class.opening);
      setTimeout(
        function() {
          this.$ele.removeClass(this.option.class.opening).addClass("opened");
        }.bind(this),
        this.option.counter
      );
    } else {
      // this.$img.removeClass("closed").addClass("opened");
      this.$ele.removeClass(this.closed).addClass(this.option.class.opened);
    }
    //this.Transition();
  };
  Module.prototype.close = function() {
    //需要精簡一下
    this.$wrap.removeClass("opened").addClass("closed");
    this.$btn.text(this.option.button.openText);
    this.$btn.append(this.$down);
    
    if (this.option.transition === true) {
      this.$ele.removeClass(this.opened).addClass(this.option.class.closing);
      setTimeout(
      function() {
        this.$img.removeClass("opened").addClass("closed");   //close: 圖最後才出來
      }.bind(this),
      this.option.counter
    );
      setTimeout(  //在transtion結束的時候卡入closing
        function() {
          this.$ele
            .removeClass(this.option.class.closing)
            .addClass(this.closed);
        }.bind(this),
        this.option.counter 
      );
    } else {
      this.$img.removeClass("opened").addClass("closed");   //因為沒有transition需要立刻處理
      this.$ele.removeClass(this.opened).addClass(this.closed);
    }
    //this.Transition();  
  };

  Module.prototype.Transition = function() {
    setInterval(
      function() {
        //要把判斷式放在setInterval裡面否則只會call一次，要去一直偵測狀態
        if (
          this.$ele.hasClass(this.option.class.closing) ||
          this.$ele.hasClass(this.option.class.opening)
        ) {
          this.option.whenTransition();
        }
      }.bind(this),
        25
    );
  };
  
  
  $.fn[ModuleName] = function(options) {
    return this.each(function() {
      var $this = $(this);
      var module = $this.data(ModuleName);
      var opts = null;
      if (!!module) {
        if (typeof options === "string" && typeof options2 === "undefined") {
          module[options]();
        } else {
          console.log("unsupported options");
          // thorw 'unsupported options!' ;
        }
      } else {
        opts = $.extend(
          {},
          Module.DEFAULTS,
          typeof options === "object" && options,
          typeof options2 === "Obect" && options2
        );
        module = new Module(this, opts);
        $(this).data(ModuleName, module);
        //初始化
        module.init();
        //註冊btn事件
        module.$btn.on("click", function(e) {
          module.toggle();
        });
      }
     
    });
  };
})(jQuery);
