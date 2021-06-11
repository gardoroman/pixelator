
const pixelator = (()=>{

    let canvas, ctx, originalImage;
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
     */
    const drawPixels = (width, height) => {
        let boxSize = 5;

        let imageWidth = originalImage.width;
        let imageHeight = originalImage.height;

        let imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);

        let pixelData = imageData.data;

        for(let y=0; y < imageHeight; y += boxSize ){
            for(let x=0; x < imageWidth; x+= boxSize){
                // each pixel is represented by four rgba values in the imageData.data Uint8ClampedArray array
                // multiply by four to get the index for the next set of rgba values.
                let index = (x + (y * imageWidth)) * 4;
                
                ctx.fillStyle = `rgba(${pixelData[index]}, ${pixelData[index+1]}, ${pixelData[index+2]}, ${pixelData[index+3]})`;
                let rectWidth = adjustDimension(x, boxSize, imageWidth);
                let rectHeight = adjustDimension(y, boxSize, imageHeight);
                ctx.fillRect(x,y, rectWidth, rectHeight);
            }
        }
    };
  
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
      btn.addEventListener('click', drawPixels, false)
  
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
  