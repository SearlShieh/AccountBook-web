<template>
  <div class="content color-2" >
    <div id="stack_buana" class="stack stack--buana" style="height:450px;width:400px">
      <div class="stack__item" style="background-color: #ffc7c7;">0
        <span style="margin: 200px;">0</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2;">1
        <span style="margin: 200px;">1</span>
      </div>
      <div class="stack__item" style="background-color: #f6f6f6">2
        <span style="margin: 200px;">2</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2">3
        <span style="margin: 200px;">3</span>
      </div>
      <div class="stack__item" style="background-color: #ffc7c7;">4
        <span style="margin: 200px;">4</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2;">5
        <span style="margin: 200px;">5</span>
      </div>
      <div class="stack__item" style="background-color: #f6f6f6">6
        <span style="margin: 200px;">6</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2">7
        <span style="margin: 200px;">7</span>
      </div>
      <div class="stack__item" style="background-color: #ffc7c7;">8
        <span style="margin: 200px;">8</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2;">9
        <span style="margin: 200px;">1</span>
      </div>
      <div class="stack__item" style="background-color: #f6f6f6">10
        <span style="margin: 200px;">2</span>
      </div>
      <div class="stack__item" style="background-color: #ffe2e2">11
        <span style="margin: 200px;">3</span>
      </div>
    </div>
    <div class="controls">
      <button class="button button--material button--reject" data-stack="stack_buana"><i class="fa fa-times"></i><span class="text-hidden">Reject</span></button>
      <button class="button button--material button--accept" data-stack="stack_buana"><i class="fa fa-check"></i><span class="text-hidden">Accept</span></button>
    </div>
  </div>
</template>

<script>
import {mode} from '../otherSource/modernizr-custom.js'
import {classie} from '../otherSource/classie.js'
import {dynamics} from '../otherSource/dynamics.min.js'
import {mainFun} from '../otherSource/main.js'
export default {
  name: 'Test',
  created () {
    function useImport () {
      // eslint-disable-next-line no-unused-expressions
      !mode(window, document)
      classie(window)
      dynamics()
      mainFun(window)
    }
    useImport()
  },
  mounted () {
    function click () {
      function mobilecheck () {
        let check = false;
        (function (a) { if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true })(navigator.userAgent || navigator.vendor || window.opera)
        return check
      }
      var clickeventtype = mobilecheck() ? 'touchstart' : 'click'
      // eslint-disable-next-line one-var,no-undef,no-unused-vars
      var support = { animations: Modernizr.cssanimations },
        // eslint-disable-next-line no-unused-vars
        animEndEventNames = { 'WebkitAnimation': 'webkitAnimationEnd',
          'OAnimation': 'oAnimationEnd',
          'msAnimation': 'MSAnimationEnd',
          'animation': 'animationend' }
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line no-unused-expressions,no-undef
      let animEndEventName = animEndEventNames[ Modernizr.prefixed('animation') ]
      // eslint-disable-next-line no-unused-vars
      let onEndAnimation = function (el, callback) {
        var onEndCallbackFn = function (ev) {
          if (support.animations) {
            if (ev.target !== this) return
            this.removeEventListener(animEndEventName, onEndCallbackFn)
          }
          if (callback && typeof callback === 'function') { callback.call() }
        }
        if (support.animations) {
          el.addEventListener(animEndEventName, onEndCallbackFn)
        } else {
          onEndCallbackFn()
        }
      }

      // eslint-disable-next-line no-unused-vars
      function nextSibling (el) {
        var nextSibling = el.nextSibling
        // eslint-disable-next-line eqeqeq
        while (nextSibling && nextSibling.nodeType != 1) {
          nextSibling = nextSibling.nextSibling
        }
        return nextSibling
      }

      // eslint-disable-next-line no-undef
      var buana = new Stack(document.getElementById('stack_buana'), {
        perspectiveOrigin: '-15% -10%'
      })

      function buttonClickCallback (bttn) {
        // eslint-disable-next-line no-redeclare
        var bttn = bttn || this
        bttn.setAttribute('data-state', 'unlocked')
      }

      // eslint-disable-next-line no-undef
      document.querySelector('.button--accept[data-stack = stack_buana]').addEventListener(clickeventtype, function () { buana.accept(buttonClickCallback.bind(this)) })
      // eslint-disable-next-line no-undef
      document.querySelector('.button--reject[data-stack = stack_buana]').addEventListener(clickeventtype, function () { buana.reject(buttonClickCallback.bind(this)) })
    }
    click()
  }
}
</script>

<style scoped>

@import '../otherSource/component.css';
</style>
