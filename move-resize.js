const interact = require('interactjs');

interact('.resize-drag')
  .draggable({
    onmove: window.dragMoveListener,
    restrict: {
      restriction: 'parent',
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
  })
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    // keep the edges inside the parent
    restrictEdges: {
      outer: 'parent',
      endOnly: true,
    },

    // minimum size
    restrictSize: {
      min: { width: 100, height: 50 },
    },

    inertia: true,
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
$(document).ready(function() {
  $("#crop").click(function(){
    // const dragsize = $(".resize-drag");
    // console.log(dragsize.attr("data-x"));
    // console.log(dragsize.attr("data-y"));
    // console.log(dragsize.height());
    // console.log(dragsize.width());
    onPreloadComplete();
  });
});

function onPreloadComplete(){
  //call the methods that will create a 64-bit version of thumbnail here.
  var imgObject = new Image();
  imgObject.src = "cat.jpg";
  const dragsize = $(".resize-drag");
  var newImg = getImagePortion(imgObject, dragsize.width(), dragsize.height(),
                               dragsize.attr("data-x"), dragsize.attr("data-y"), 1);
  //place image in appropriate div
  $("body").html("<img src=\""+newImg+"\" />")
};

function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio){
  /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
  //set up canvas for thumbnail
  var tnCanvas = document.createElement('canvas');
  var tnCanvasContext = tnCanvas.getContext('2d');
  tnCanvas.width = newWidth; tnCanvas.height = newHeight;
  
  /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
  var bufferCanvas = document.createElement('canvas');
  var bufferContext = bufferCanvas.getContext('2d');
  bufferCanvas.width = imgObj.width;
  bufferCanvas.height = imgObj.height;
  bufferContext.drawImage(imgObj, 0, 0);
  
  /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
  tnCanvasContext.drawImage(bufferCanvas, startX,startY,newWidth * ratio, newHeight * ratio,0,0,newWidth,newHeight);
  return tnCanvas.toDataURL();
 };
  window.dragMoveListener = dragMoveListener;