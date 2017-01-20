// RIPPLE EFFECT IN CSS AND JAVASCRIPT

// UMD MODULE
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports==="object"&&typeof module!=="undefined") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Define global constructor
        root.ripple = factory();
    }

}(this, function() {

  var stylesheet = `
    .ripple{
      background:rgba(0,0,0,.02);
      border-radius: inherit;
      width:100%;
      height:100%;
      left:0;
      top:0;
      position:absolute;
      z-index:0;
      visibility:hidden;
      opacity:0;
      overflow:hidden;
      transition:opacity .5s,transform .5s,visibility .5s;
    }
    .ripple.mousedown{
      transition:opacity .1s,transform .1s,visibility .1s;
      transform:scale3d(1,1,1);
      visibility:visible;
      opacity:1;
    }
    .ripple>div{
      width:300px;
      height:300px;
      border-radius: 50%;
      background:rgba(0,0,0,.05);
      position:absolute;
      z-index:0;
      transform:scale3d(0,0,1);
      transition:transform .5s cubic-bezier(.17,.84,.44,1) 0s;
    }
    .ripple>div.animating{
      transform:scale3d(1,1,1);
    }
  `;

  var style = document.createElement( "style" );
  style.innerHTML = stylesheet;

  function makeRipple( el )
  {
    var clip = document.createElement( "div" );
    clip.classList.add( "ripple" );

    el.appendChild( clip );
    var mouseupTimeout = 0;

    el.addEventListener( "mousedown", function( e ) {

      function drawRipple( e )
      {
        var rippleDim = Math.max( rect.width, rect.height ) * 2;

        ripple.style.width = ripple.style.height = rippleDim + 'px';
        ripple.style.left = ( e.clientX - rect.left - rippleDim / 2 ) + 'px';
        ripple.style.top = ( e.clientY - rect.top - rippleDim / 2 ) + 'px';
      }

      function onMouseUp()
      {
        setTimeout( function() {
          clip.classList.remove( "mousedown" );
          l = true;
        }, 100 );

        el.removeEventListener( "mouseup", onMouseUp );
        el.removeEventListener( "mouseleave", onMouseUp );
        el.removeEventListener( "mousemove", drawRipple );
      }

      var rect = el.getBoundingClientRect();
      var ripple = document.createElement( "div" );

      drawRipple( e );

      clip.appendChild( ripple );

      setTimeout( function() {
        clip.classList.add( "mousedown" );
        ripple.classList.add( "animating" );
      }, 10 );

      var l = false;
      var z = setInterval( function(){
        if ( !l )
          return;

        clip.removeChild( ripple );
        clearInterval( z );
      }, 600 );

      el.addEventListener( "mouseup", onMouseUp );
      el.addEventListener( "mouseleave", onMouseUp );
      el.addEventListener( "mousemove", drawRipple );
    });
  }

  return function( el ) {
    // el can be Array or Array-like object
    el = el[0] ? el : [ el ];

    for ( var i in el )
      makeRipple( el[i] );

    document.head.appendChild( style );
  };
}));
