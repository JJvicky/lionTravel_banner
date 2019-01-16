(function($) {
    var ModuleName = 'banner';

    var Module = function (element, opt){
        this.ele = element; //element: banner DOM物件
        this.$ele = $(element) ; //  n.fn 物件
        this.$btn = $(`<div class =${opt.button.class} ></div>`);
        this.$up =$('<i class="fas fa-sort-up"></i>');
        this.$down = $('<i class="fas fa-caret-down"></i>');
        this.option =opt;
        this.$img = $("img");
        this.$wrap =$(".wrap");
        // this.state = $ele.data("state");
        this.opened = opt.class.opened;
        this.closed =opt.class.closed;
    }

    Module.DEFAULTS = {
       openAtStart : true,
       autoToggle : false,  //[boolean|number] true | false | 3000
       button: {
        closeText: '收合', // [string]
        openText: '展開', // [string]
        class: 'btn' // [string]
    },
    class : {
        closed : 'closed',
        closing: 'closing',
        opened : 'opened',
        opening: 'opening'
    },
    transition: true,
    counter : 1500,    //控制transition
    whenTransition: function(){
            console.log('whenTransition');
            
        }
    }
    //開始寫Function
    Module.prototype.init = function(){
      this.$ele.append(this.$btn);  // 1. button初始
      var openAtStart = this.option.openAtStart;  //2. 畫面是否先開
      console.log(openAtStart);
      if(openAtStart === true){                  
       this.$btn.text(this.option.button.closeText);
       this.$btn.append(this.$up);
       this.$ele.addClass(this.opened);
       this.$wrap.addClass("opened"); 
       this.$img.addClass("opened");
    //    this.$ele.data("state","opened");
      }else{
       this.$btn.text(this.option.button.openText);
       this.$btn.append(this.$down)
       this.$ele.addClass(this.closed);
       this.$img.addClass("closed");
       this.$wrap.addClass("closed"); 
    //    this.$ele.data("state","closed");
      }
   
      if( this.option.transition ){
          this.addTransition();
      }
      if( this.option.autoToggle){
          this.toggle();
      }

      };
    Module.prototype.addTransition = function(){       
            this.$wrap.addClass("transition");
    }  
    Module.prototype.toggle = function(){
        console.log("hastoggle");
        if( isNaN(this.option.autoToggle) === false){
            console.log("toggle=number");
            setInterval(this.click.bind(this),this.option.autoToggle); 
        }else if (this.option.autoToggle === true){
            console.log("toggle = default");
            setInterval(this.click.bind(this),this.option.counter); 
        }
        
    }
    Module.prototype.click = function(){
        if(this.$ele.hasClass(this.opened)){    //banner為open狀態，執行關閉
            this.close();
        } else if (this.$ele.hasClass(this.closed)){  //banner為close狀態, 執行開啟
            this.open();
        }
        this.Transition();
    }
    Module.prototype.open = function(){    //需要精簡一下
        this.$wrap.removeClass("closed").addClass("opened");     
        this.$btn.text(this.option.button.closeText).append(this.$up);   
        this.$img.removeClass("closed").addClass("opened");
        if (this.option.transition === true){
            this.$ele.removeClass(this.closed).addClass(this.option.class.opening);
          setTimeout(function(){
            this.$ele.removeClass(this.option.class.opening).addClass("opened"); 
          }.bind(this),this.option.counter)       
        } else {
            // this.$img.removeClass("closed").addClass("opened");
            this.$ele.removeClass(this.closed).addClass(this.option.class.opening);
        }
    }
    Module.prototype.close =function(){    //需要精簡一下
        this.$wrap.removeClass("opened").addClass("closed");   
        this.$btn.text(this.option.button.openText)
        this.$btn.append(this.$down);
        let imgAction =  setTimeout(function(){
            this.$img.removeClass("opened").addClass("closed"); 
            }.bind(this),this.option.counter)

        if(this.option.transition === true){
            this.$ele.removeClass(this.opened).addClass(this.option.class.closing);
            imgAction
            setTimeout(function(){
                this.$ele.removeClass(this.option.class.closing).addClass(this.closed);
            }.bind(this), this.option.counter);
        } else {
            this.$ele.removeClass(this.opened).addClass(this.closed);
            imgAction
        }
    }

    Module.prototype.Transition =function(){
        setInterval(function(){
        //要把判斷式放在setInterval裡面否則只會call一次，要去一直偵測狀態    
        if (this.$ele.hasClass(this.option.class.closing) || this.$ele.hasClass(this.option.class.opening)){
        this.option.whenTransition();
        }}.bind(this),500)
    };
    $.fn[ModuleName] = function( options, options2){
        return this.each(function(){
            var $this = $(this);
            var module = $this.data(ModuleName);
            var opts = null;
            if (!!module){
                if (typeof options === 'string' && typeof options2 === "undefined"){
                    module[options]();
                } else {
                    console.log('unsupported options');
                    // thorw 'unsupported options!' ;
                }
            }else {
                opts = $.extend({}, Module.DEFAULTS,(typeof options ==='object'&& options),(typeof options2 === 'Obect' && options2));
            }
            module = new Module (this, opts);  
            $(this).data(ModuleName, module);
            //初始化
            module.init();
            //註冊btn事件
            module.$btn.on('click',function(e){
                module.click();
            })
        })
    }
})(jQuery);
