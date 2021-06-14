
const pixelator = (()=>{

    let canvas, ctx, originalImage;
    let partialSelection = {};
    const init = ()=> {
      canvas = document.querySelector('canvas');
      ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
    };
  
    const setToScale = (imageDim1, imageDim2, canvasDim) => {
      var ratio = imageDim1 /imageDim2;
      var scaledDim = parseInt(canvasDim / ratio);
      return scaledDim;
    };


    /**
     * Adjust values that exceed dimensions of image
     */
    const adjustDimension = (coordinate, boxSize, dimension) => {
        if(coordinate + boxSize > dimension){
            return dimension - coordinate
        }
        return boxSize;
    }

    /**
     * Loop through image array and overwrite the 
     * rgba values for the surrounding pixels by
     * the rgba value of the first pixel in the iteration.
     * 
     * If width and height contain integer values, the function
     * was called by the user selection of a portion of
     * the image.
     */
    
    const drawPixels = (width, height, offSetX, offSetY) => {
      let boxSize = 5;
  
      let imageData = ctx.getImageData(0, 0, width, height);

      let pixelData = imageData.data;
  
      for(let y = offSetY; y < height; y += boxSize){
        for(let x = offSetX; x < width; x += boxSize){
            // each pixel is represented by four rgba values in the imageData.data Uint8ClampedArray array
            // multiply by four to get the index for the next set of rgba values.
            let index = (x + (y * width)) * 4;
            
            ctx.fillStyle = `rgba(${pixelData[index]}, ${pixelData[index+1]}, ${pixelData[index+2]}, ${pixelData[index+3]})`;
            let rectWidth = adjustDimension(x, boxSize, width);
            let rectHeight = adjustDimension(y, boxSize, height);
            ctx.fillRect(x, y, rectWidth, rectHeight);
          }
      }
    };    

    const handleMouseUp = event => {
      partialSelection.upX = event.offsetX;
      partialSelection.upY = event.offsetY;
      let width = Math.abs(partialSelection.downX - event.offsetX)
      let height = Math.abs(partialSelection.downY - event.offsetY)
      let x = Math.min(partialSelection.downX, event.offsetX)
      let y = Math.min(partialSelection.downY, event.offsetY)
      drawPixels(width + x, height + y, x, y)
    };
  
    const handleMouseDown = event => {
        partialSelection.downX = event.offsetX;
        partialSelection.downY = event.offsetY;
    };

    const handleClick = _event => {
      drawPixels(originalImage.width, originalImage.height, 0, 0)
    }

    const getImage = image => {
      /* Note:
      The code below keeps the ratio of the image.
      Keep for future implementations to give user option to retain original ratio.
      */
      //canvas.width = image.width;
      //canvas.height = image.height;
  
      // removes any pixels if a new picture is selected
      ctx.clearRect(0,0, canvas.width, canvas.height);
  
      // Dynamically size image to fit the canvas.
      var canvasWidth, canvasHeight;
      if (image.width > image.height){
        canvasWidth = canvas.width;
        canvasHeight = setToScale(image.width, image.height, canvasWidth);
      } else if (image.width < image.height) {
        canvasHeight = canvas.height;
        canvasWidth = setToScale(image.height, image.width,canvasHeight );
      } else {
        canvasWidth = canvasHeight = canvas.width;
      }
      image.width = canvasWidth;
      image.height = canvasHeight;
  
      originalImage = image
      ctx.drawImage(image, 0, 0, image.width, image.height);

      let btn = document.getElementById('btn-pixelate')
      btn.style.display = 'block';
      btn.addEventListener('click', handleClick, false)

      let canvasElement = document.getElementById('canvas-elem');
      canvasElement.addEventListener('mousedown', handleMouseDown, false);
      canvasElement.addEventListener('mouseup', handleMouseUp, false);
  
    };
  
    const handleFileSelect = evt => {
      const file = evt.target.files[0];
    
      const reader = new FileReader();
      reader.onload = fileObject => {
        var data = fileObject.target.result;

        // Create an image object
        var image = new Image();
        image.onload = function(){
          window.imageSrc = this;
          getImage(window.imageSrc);
        }
  
        image.src = data;
      };
      reader.readAsDataURL(file)
    };
  
  
    return {
      init: init,
      setToScale: setToScale,
      getImage: getImage,
      handleFileSelect: handleFileSelect
    }
  })();
  
  pixelator.init();
  document.getElementById('file-select').addEventListener('change', pixelator.handleFileSelect, false);
  