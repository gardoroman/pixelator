
const pixelator = (()=>{

    let canvas, ctx;
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

    const drawPixels = imageData => {

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
  
      ctx.drawImage(image, 0, 0, image.width, image.height);
  
      let imageData = ctx.getImageData(0, 0, image.width, image.height);
  
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
  