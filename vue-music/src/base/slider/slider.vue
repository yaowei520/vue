<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
     <div class="dots">
        <span v-for="(dot,index) in dots" class="dot" :class="{active:index===pageIndex}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from "common/js/dom.js"
  export default {
      data:function(){
        return {
          children:"",
          scroll:"",
          dots:"",
          pageIndex:0
        }
      },
      name:"slider",
      props:{
        loop:{
          type:Boolean,
          default:true
        },
        autoPlay:{
          type:Boolean,
          default:true
        },
        interval:{
          type:Number,
          default:4000
        }
      },
      mounted:function(){
       setTimeout(()=>{
        this._setWidth();
        this._init_dot();
        this._init_scroll();
        if(this.autoPlay){
          this._play();
        }
         },20)
         window.addEventListener("resize",function(){
            if(!this.scroll){
              return
            }
            this._setWidth(true);
            this.scroll.refresh()
         })
        },
      methods:{
        _setWidth:function(isResize){
            var width=0;
            this.children = this.$refs.sliderGroup.children;
            var sliderWidth = $(this.$refs.slider).width();
            //$(this.$refs.sliderGroup).find("div").addClass("slider-item"); 
            for(var i=0;i<this.children.length;i++){
              width+=sliderWidth
              this.children[i].style.width=sliderWidth+"px"
              addClass(this.children[i],"slider-item")
            }
            if(this.loop && !isResize){
              width+=sliderWidth*2
            }
            this.$refs.sliderGroup.style.width=width+"px"
        },
        _init_dot:function(){
          this.dots=new Array(this.children.length)
        },
        _init_scroll:function(){
          console.log(this.loop)
          this.scroll = new BScroll(this.$refs.slider, {
              scrollY: false,
              scrollX: true,
              snapSpeed: 400,
              snap:true,
              snapLoop: this.loop,

              snapThreshold: 0.2
            })
            this.scroll.on("scrollEnd", () => {
              let index = this.scroll.getCurrentPage().pageX
              console.log(index)
              if(this.loop){
                index -= 1
              }
              this.pageIndex = index
              if(this.autoPlay){
                clearTimeout(this.timer);
                this._play();
              }
            })
        },
        _play:function(){
          let index=this.pageIndex + 1
          if(this.loop){
            index += 1
          }
          this.timer=setTimeout(() => {
              this.scroll.goToPage(index, 0, 400)
          },this.interval)
        }

      },
      deactivated:function(){
        clearTimeout(this.timer)
      },
      activated(){
        if(this.autoPlay){
          this._play()
        }
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    position:relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>