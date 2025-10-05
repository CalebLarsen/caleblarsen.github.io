const imageInput = document.getElementById('imageInput');
let animationFrameId = null;
let worker;

function setupWorker(){
  worker = new Worker('./assets/scripts/image_worker.js');

  worker.onmessage = function(e) {
    const { step, data } = e.data;
    console.log(`Main page received result for: ${step}`);
    const canvas = document.getElementById(`canvas-${step}`);

    if (step === 'triangulation') {
      document.body.style.cursor = 'default';
      const {triangles, averageColors} = data;
      drawTriangles(triangles, document.getElementById('canvas-uncolored'));
      drawColorTriangles(triangles, averageColors, document.getElementById('canvas-colored'));
      if (animationFrameId){
        cancelAnimationFrame(animationFrameId);
      }
    
      animatedCanvas(triangles, averageColors, document.getElementById('canvas-animated'));
    }
    else if (step === 'vertices'){
      drawVertices(document.getElementById('canvas-vertices'), data);
    }
    else {
      if (canvas) {
        displayImage(canvas, data);
      }
    }
  };
}

imageInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file){
    return;
  }

  const imageURL = URL.createObjectURL(file);
  const img = new Image();

  img.onload = function() {
    const MAX_SIZE = 800;
    let width = img.width;
    let height = img.height;
    if (width > MAX_SIZE || height > MAX_SIZE){
      if (width > height){
        const aspectRatio = height / width;
        width = MAX_SIZE;
        height = width * aspectRatio;
      }
      else {
        const aspectRatio = width / height;
        height = MAX_SIZE;
        width = height * aspectRatio;
      }
    }
    const canvasOriginal = document.getElementById('canvas-original');
    const canvasBlurred = document.getElementById('canvas-blurred');
    const canvasGrayscale = document.getElementById('canvas-grayscale');
    const canvasSobel = document.getElementById('canvas-sobel');
    const canvasThreshold = document.getElementById('canvas-threshold');
    const canvasThinned = document.getElementById('canvas-thinned');
    const canvasVertices = document.getElementById('canvas-vertices');
    const canvasTriangled = document.getElementById('canvas-uncolored');
    const canvasFinal = document.getElementById('canvas-colored');
    const canvasAnimated = document.getElementById('canvas-animated');
    const canvases = [canvasOriginal, canvasBlurred, canvasGrayscale, canvasSobel, canvasThreshold, canvasThinned, canvasVertices, canvasTriangled, canvasFinal, canvasAnimated];
    canvases.forEach((canvas) => {
      console.log(canvas);
      canvas.width = width;
      canvas.height = height;
    })
    const ctx = canvasOriginal.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    initialImageData = ctx.getImageData(0, 0, width, height);
    URL.revokeObjectURL(imageURL);
    startPipeline();
  };
  img.src = imageURL;
});

let initialImageData = null;
const blurSlider = document.getElementById('blurSigma');
const thresholdRadios = document.querySelectorAll('input[name="threshold-type"]');
const globalThresholdSlider = document.getElementById('threshold');
const globalControls = document.getElementById('global-threshold-controls');
const niblackControls = document.getElementById('niblack-threshold-controls');
const niblackSizeSlider = document.getElementById('niblack-size');
const niblackKSlider = document.getElementById('niblack-k');
const verticesSlider = document.getElementById('maxVertices');
const shuffleCheckbox = document.getElementById('shuffleCheckbox');

const blurValueSpan = document.getElementById('blurValue');
const verticesValueSpan = document.getElementById('verticesValue');

function startPipeline() {
  if (!initialImageData) return;

  if (worker){
    worker.terminate();
  }
  setupWorker();

  const params = {
    sigma: parseFloat(blurSlider.value),
    maxVertices: parseInt(verticesSlider.value),
    doShuffle: shuffleCheckbox.checked,
    thresholdType: document.querySelector('input[name="threshold-type"]:checked').value,
    globalThresholdValue: parseInt(globalThresholdSlider.value),
    niblackSize: parseInt(niblackSizeSlider.value),
    niblackK: parseFloat(niblackKSlider.value)
  };

  console.log('Starting pipeline with params:', params);
  
  document.body.style.cursor = 'wait';

  worker.postMessage({ imageData: initialImageData, params: params });
}

const debouncedStart = debounce(startPipeline, 100);

blurSlider.addEventListener('input', () => {
  blurValueSpan.textContent = blurSlider.value;
  debouncedStart();
});
thresholdRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'global'){
      globalControls.classList.remove('hidden');
      niblackControls.classList.add('hidden');
    } else {
      globalControls.classList.add('hidden');
      niblackControls.classList.remove('hidden');
    }
    debouncedStart();
  })
})
globalThresholdSlider.addEventListener('input', () => {
  document.getElementById('thresholdValue').textContent = globalThresholdSlider.value;
  debouncedStart();
});
niblackSizeSlider.addEventListener('input', () => {
    document.getElementById('niblack-size-value').textContent = niblackSizeSlider.value;
    debouncedStart();
});
niblackKSlider.addEventListener('input', () => {
    document.getElementById('niblack-k-value').textContent = niblackKSlider.value;
    debouncedStart();
});
verticesSlider.addEventListener('input', () => {
  verticesValueSpan.textContent = verticesSlider.value;
  debouncedStart();
});
shuffleCheckbox.addEventListener('change', debouncedStart);


function drawTriangles(triangles, targetCanvas){
  const ctx = targetCanvas.getContext('2d');
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;

  for (const triangle of triangles){
    ctx.beginPath();
    ctx.moveTo(triangle.p1.x, triangle.p1.y);
    ctx.lineTo(triangle.p2.x, triangle.p2.y);
    ctx.lineTo(triangle.p3.x, triangle.p3.y);
    ctx.closePath();
    ctx.stroke();
  }
}

function drawColorTriangles(triangles, averageColors, targetCanvas) {
  const ctx = targetCanvas.getContext('2d');
  const imgWidth = targetCanvas.width;
  const imgHeight = targetCanvas.height;

  ctx.clearRect(0, 0, imgWidth, imgHeight);
  
  for (let i = 0; i < triangles.length; i++) {
    const triangle = triangles[i];
    const color = averageColors[i];
    const colorStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    
    ctx.beginPath();
    ctx.moveTo(triangle.p1.x, triangle.p1.y);
    ctx.lineTo(triangle.p2.x, triangle.p2.y);
    ctx.lineTo(triangle.p3.x, triangle.p3.y);
    ctx.closePath();
    
    ctx.fillStyle = colorStyle;
    ctx.fill();

    ctx.strokeStyle = colorStyle;
    ctx.stroke();
  }
}

function displayImage(canvas, imageData){
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
}

function animatedCanvas(triangles, averageColors, targetCanvas){
  const ctx =targetCanvas.getContext('2d');

  const maxVertices = parseInt(verticesSlider.value);

  
  let triangleIndex = 0;
  let frameCounter = 0;
  let speed;
  if (maxVertices > 2000){
    speed = 0;
  }
  else if (maxVertices > 1000){
    speed = 1;
  }
  else if (maxVertices > 500){
    speed = 2;
  }
  else {
    speed = 3;
  }
  const pauseDuration = 120;

  function animationLoop() {
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (const triangle of triangles){
      ctx.beginPath();
      ctx.moveTo(triangle.p1.x, triangle.p1.y);
      ctx.lineTo(triangle.p2.x, triangle.p2.y);
      ctx.lineTo(triangle.p3.x, triangle.p3.y);
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < triangleIndex; i++){
      const triangle = triangles[i];
      const color = averageColors[i];
      const colorStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

      ctx.beginPath();
      ctx.moveTo(triangle.p1.x, triangle.p1.y);
      ctx.lineTo(triangle.p2.x, triangle.p2.y);
      ctx.lineTo(triangle.p3.x, triangle.p3.y);
      ctx.closePath();

      ctx.fillStyle = colorStyle;
      ctx.fill();
      ctx.strokeStyle = colorStyle;
      ctx.stroke();
    }

    frameCounter += 1;

    if (triangleIndex < triangles.length){
      if (frameCounter >= speed){
        triangleIndex += 1;
        frameCounter = 0;
      }
    }
    else {
      if (frameCounter >= pauseDuration) {
        triangleIndex = 0;
        frameCounter = 0;
      }
    }

    animationFrameId = requestAnimationFrame(animationLoop);
  }
  animationLoop();
}

function debounce(func, delay){
  let timeout;
  return function(...args){
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  }
}

function drawVertices(targetCanvas, vertices){
  const ctx = targetCanvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

  ctx.fillStyle = 'white';
  for (const point of vertices){
    ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
  }  
}
