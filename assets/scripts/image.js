const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const WHITE = 255;
const BLACK = 0;

imageInput.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file){
    const imageURL = URL.createObjectURL(file);
    imagePreview.src = imageURL;
  }
});

imagePreview.onload = function(){
  const MAX_SIZE = 800;
  let width = imagePreview.width;
  let height = imagePreview.height;
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
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCtx.drawImage(imagePreview, 0, 0, width, height);
  const initialImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  const canvasOriginal = document.getElementById('canvas1');
  const canvasGrayscale = document.getElementById('canvas2');
  const canvasBlurred = document.getElementById('canvas3');
  const canvasSobel = document.getElementById('canvas4');
  const canvasThreshold = document.getElementById('canvas5');
  const canvasThinned = document.getElementById('canvas6');
  const canvasFinal = document.getElementById('canvas7');

  displayImage(canvasOriginal, initialImageData);
  const gray = grayscale(initialImageData);
  displayImage(canvasGrayscale, gray);
  const blurred = gaussian(gray, 0.8);
  displayImage(canvasBlurred, blurred);
  const edges = sobel(blurred);
  displayImage(canvasSobel, edges);
  const thresh = threshold(edges, 15, -0.2)
  displayImage(canvasThreshold, thresh);
  const thin = thinning(thresh);
  displayImage(canvasThinned, thin);
  const vertices = getVertices(thin);
  vertices.push(new Point(0, 0));
  vertices.push(new Point(canvasOriginal.width - 1, 0));
  vertices.push(new Point(0, canvasOriginal.height - 1));
  vertices.push(new Point(canvasOriginal.width - 1, canvasOriginal.height - 1));

  const triangles = triangulate(vertices);
  drawColorTriangles(triangles, initialImageData, canvasFinal);
};

// Assumes the kernel is an N x N matrix where N is odd.
function applyKernel(srcImg, kernel){
  const imgWidth = srcImg.width;
  const imgHeight = srcImg.height;
  let outImg = new ImageData(imgWidth, imgHeight);
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const halfWidth = Math.floor(kernelWidth/2);
  const halfHeight = Math.floor(kernelHeight/2);
  for (let y = 0; y < imgHeight; y++){
    for (let x = 0; x < imgWidth; x++){
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let y_off = -halfHeight; y_off < halfHeight+1; y_off++){
        for (let x_off = -halfWidth; x_off < halfWidth+1; x_off++){
          let x_index = x+x_off;
          let y_index = y+y_off;
          if (x_index < 0){
            x_index = 0;
          }
          else if (x_index >= imgWidth){
            x_index = imgWidth - 1;
          }
          if (y_index < 0){
            y_index = 0;
          }
          else if (y_index >= imgHeight){
            y_index = imgHeight - 1;
          }
          let pixelIndex = (y_index*imgWidth + x_index)*4;
          let kernelY = (y_off+halfHeight);
          let kernelX = (x_off+halfWidth);
          let kernelVal = kernel[kernelY][kernelX];
          r += srcImg.data[pixelIndex + 0] * kernelVal;
          g += srcImg.data[pixelIndex + 1] * kernelVal;
          b += srcImg.data[pixelIndex + 2] * kernelVal;
          a += srcImg.data[pixelIndex + 3] * kernelVal;
        }
      }
      let outIndex = (y*imgWidth+x) * 4;
      outImg.data[outIndex+0] = Math.round(r);
      outImg.data[outIndex+1] = Math.round(g);
      outImg.data[outIndex+2] = Math.round(b);
      outImg.data[outIndex+3] = Math.round(a);
    }
  }
  return outImg;
}

function makeGaussianKernel(sigma){
  const size = (Math.ceil(sigma * 3) * 2) + 1; // Should make it odd
  let kernel = Array(size).fill(0).map(() => Array(size).fill(0)); // Unsure if filling is necessary
  const halfSize = Math.floor(size / 2);
  let kernelSum = 0;

  for (let y = -halfSize; y < halfSize+1; y++){
    for (let x = -halfSize; x < halfSize+1; x++){
      // Formula from https://en.wikipedia.org/wiki/Gaussian_blur#Mathematics
      // Specifically the 2d formula listed
      const exp = -(x*x + y*y) / (2 * sigma * sigma);
      const weight = (1 / (2 * Math.PI * sigma * sigma)) * Math.exp(exp);
      kernel[y+halfSize][x+halfSize] = weight;
      kernelSum += weight;
    }
  }
  for (let y = 0; y < size; y++){
    for (let x = 0; x < size; x++){
      kernel[y][x] /= kernelSum;
    }
  }

  return kernel;

}

function gaussian(srcImg, sigma){
  const kernel = makeGaussianKernel(sigma);
  let result = applyKernel(srcImg, kernel);
  return result;
}

function grayscale(srcImg){
  let outImg = new ImageData(srcImg.width, srcImg.height);
  for (let y = 0; y < srcImg.height; y++){
    for (let x = 0; x < srcImg.width; x++){
      i = (y * srcImg.width + x) * 4;
      r = srcImg.data[i+0];
      g = srcImg.data[i+1];
      b = srcImg.data[i+2];
      avg = (r + g + b) / 3
      outImg.data[i+0] = avg;
      outImg.data[i+1] = avg;
      outImg.data[i+2] = avg;
      outImg.data[i+3] = 255;
    }
  }
  return outImg;
}

// srcImg should be grayscale
function sobel(srcImg){
  let x_kernel = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  let y_kernel = [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1]
  ];
  let outImg = new ImageData(srcImg.width, srcImg.height);
  for (let y = 0; y < outImg.height; y++){
    for (let x = 0; x < outImg.width; x++){
      let gx = 0;
      let gy = 0;
      for (let y_off = -1; y_off <= 1; y_off++){
        for (let x_off = -1; x_off <= 1; x_off++){
          let x_i = x + x_off;
          let y_i = y + y_off;
          if (x_i < 0){
            x_i = 0;
          }
          else if (x_i >= outImg.width){
            x_i = outImg.width - 1;
          }
          if (y_i < 0){
            y_i = 0;
          }
          else if (y_i >= outImg.height){
            y_i = outImg.height - 1;
          }
          const i = (y_i*outImg.width + x_i) * 4;
          const val = srcImg.data[i];
          gx += val * x_kernel[y_off + 1][x_off + 1];
          gy += val * y_kernel[y_off + 1][x_off + 1];
        }
      }
      const result = Math.sqrt(gx*gx + gy*gy);
      const i = (y*srcImg.width+x)*4;
      outImg.data[i+0] = result;
      outImg.data[i+1] = result;
      outImg.data[i+2] = result;
      outImg.data[i+3] = 255;
    }
  }
  return outImg;
}

// srcImg should be grayscale
// size should be odd
function getPixelStats(srcImg, x, y, size){
  const radius = Math.floor(size/2);

  const values = [];
  for (let y_off = -radius; y_off < radius+1; y_off++){
    for (let x_off = -radius; x_off < radius+1; x_off++){
      let x_i = x + x_off;
      let y_i = y + y_off;
      if (x_i < 0){
        x_i = 0;
      }
      else if (x_i >= srcImg.width){
        x_i = srcImg.width-1;
      }
      if (y_i < 0){
        y_i = 0;
      }
      else if (y_i >= srcImg.height){
        y_i = srcImg.height-1;
      }
      pixel_i = (y_i * srcImg.width + x_i) * 4;
      values.push(srcImg.data[pixel_i]);
    }
  }
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;

  const sum_of_devs = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0);
  const std_dev = Math.sqrt(sum_of_devs / values.length);
  return {avg, std_dev};
}

// srcImg should be grayscale
// size should be odd
function threshold(srcImg, size, k){
  let outImg = new ImageData(srcImg.width, srcImg.height);

  for (let y = 0; y < srcImg.height; y++){
    for (let x = 0; x < srcImg.width; x++){
      const {avg, std_dev} = getPixelStats(srcImg, x, y, size);
      // const threshold = avg * (1 + k * (std_dev / 128 - 1));
      const threshold = avg + (k * std_dev);
      const i = (y * srcImg.width + x) * 4;
      const val = srcImg.data[i];
      const out_val = val > threshold ? BLACK : WHITE;
      outImg.data[i+0] = out_val;
      outImg.data[i+1] = out_val;
      outImg.data[i+2] = out_val;
      outImg.data[i+3] = 255;
    }
  }
  return outImg;
}

function at(img, x, y){
  return img.data[(y*img.width+x)*4];
}

function neighbors(img, x, y){
  n = [];
  n.push(at(img,   x, y-1));
  n.push(at(img, x+1, y-1));
  n.push(at(img, x+1,   y));
  n.push(at(img, x+1, y+1));
  n.push(at(img,   x, y+1));
  n.push(at(img, x-1, y+1));
  n.push(at(img, x-1,   y));
  n.push(at(img, x-1, y-1));
  return n;
}

function transitions(ns){
  let ts = 0;
  for (let i = 0; i < ns.length; i++){
    let next = (i + 1) % ns.length;
    if (ns[i] == WHITE && ns[next] == BLACK){
      ts += 1;
    } 
  }
  return ts;
}

// srcImg should be pure black and white
function thinning(srcImg){
  let deletions = true;
  let outImg = new ImageData(srcImg.width, srcImg.height);
  outImg.data.set(srcImg.data);
  while (deletions){
    deletions = false;
    // Pass 1
    let to_delete = [];
    for (let y = 1; y < outImg.height - 1; y++){
      for (let x = 1; x < outImg.width - 1; x++){
        if (at(outImg, x, y) == 0){
          const ns = neighbors(outImg, x, y);
          const neighbor_count = ns.reduce((acc, val) => acc + (val == BLACK ? 1 : 0), 0);
          if (neighbor_count >= 2 && neighbor_count <= 6) {
            if (transitions(ns) == 1){
              if (ns[0] == WHITE || ns[2] == WHITE || ns[4] == WHITE){
                if (ns[2] == WHITE || ns[4] == WHITE || ns[6] == WHITE){
                  to_delete.push({x, y});
                }
              }
            }
          }
        }
      }
    }
    if (to_delete.length > 0){
      deletions = true;
      to_delete.forEach(({x, y}) => {
        const i = (y * outImg.width + x) * 4;
        outImg.data[i+0] = WHITE;
        outImg.data[i+1] = WHITE;
        outImg.data[i+2] = WHITE;
      });
    }
    // Pass 2
    to_delete = [];
    for (let y = 1; y < outImg.height - 1; y++){
      for (let x = 1; x < outImg.width - 1; x++){
        if (at(outImg, x, y) == 0){
          const ns = neighbors(outImg, x, y);
          const neighbor_count = ns.reduce((acc, val) => acc + (val == BLACK ? 1 : 0), 0);
          if (neighbor_count >= 2 && neighbor_count <= 6) {
            if (transitions(ns) == 1){
              if (ns[0] == WHITE || ns[2] == WHITE || ns[6] == WHITE){
                if (ns[0] == WHITE || ns[4] == WHITE || ns[6] == WHITE){
                  to_delete.push({x, y});
                }
              }
            }
          }
        }
      }
    }
    if (to_delete.length > 0){
      deletions = true;
      to_delete.forEach(({x, y}) => {
        const i = (y * outImg.width + x) * 4;
        outImg.data[i+0] = WHITE;
        outImg.data[i+1] = WHITE;
        outImg.data[i+2] = WHITE;
      });
    }
  }
  return outImg;
}

function getVertices(img){
  let vertices = [];
  for (let y = 0; y < img.height; y++){
    for (let x = 0; x < img.width; x++){
      const i = (y * img.width + x) * 4;
      if (img.data[i] == BLACK && Math.random() < 0.15){
        vertices.push(new Point(x, y));
      }
    }
  }
  return vertices;
}

class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Edge {
  constructor(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
  }
}

class Triangle {
  constructor(p1, p2, p3){
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.edges = [
      new Edge(p1, p2),
      new Edge(p2, p3),
      new Edge(p3, p1)
    ];

    this.circumcircle = findCircumcircle(this);
  }
}

class Circle {
  constructor(center, radius){
    this.center = center;
    this.radius = radius;
  }
}

function findCircumcircle(t){
  const D = 2*(t.p1.x * (t.p2.y - t.p3.y) + t.p2.x * (t.p3.y - t.p1.y) + t.p3.x * (t.p1.y - t.p2.y));
  if (Math.abs(D) < 1e-10){
    return null;
  }
  const p1_sq = t.p1.x*t.p1.x + t.p1.y*t.p1.y;
  const p2_sq = t.p2.x*t.p2.x + t.p2.y*t.p2.y;
  const p3_sq = t.p3.x*t.p3.x + t.p3.y*t.p3.y;
  const centerX = (1 / D) * (p1_sq * (t.p2.y - t.p3.y) + p2_sq * (t.p3.y - t.p1.y) + p3_sq * (t.p1.y - t.p2.y));
  const centerY = (1 / D) * (p1_sq * (t.p3.x - t.p2.x) + p2_sq * (t.p1.x - t.p3.x) + p3_sq * (t.p2.x - t.p1.x));

  const center = new Point(centerX, centerY);
  const radius = Math.sqrt(Math.pow(t.p1.x - centerX, 2) + Math.pow(t.p1.y - centerY, 2));
  return new Circle(center, radius);
}

function createSuperTriangle(points){
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points){
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  const dx = maxX - minX;
  const dy = maxY - minY;
  const deltaMax = Math.max(dx, dy);
  const midX = minX + dx/2;
  const midY = minY + dy/2;

  const p1 = new Point(midX - 2 * deltaMax, midY - deltaMax);
  const p2 = new Point(midX, midY + 2*deltaMax);
  const p3 = new Point(midX + 2 * deltaMax, midY - deltaMax);

  return new Triangle(p1, p2, p3);
}

function pointInCircumcircle(point, triangle){
  if (!triangle.circumcircle){
    return false;
  }
  const dx = point.x - triangle.circumcircle.center.x;
  const dy = point.y - triangle.circumcircle.center.y;
  const distSq = dx*dx + dy*dy;
  const radiusSq = triangle.circumcircle.radius * triangle.circumcircle.radius;

  return distSq < radiusSq;
}

function edgesEqual(edge1, edge2){
  const samePoints    = (edge1.p1 === edge2.p1 && edge1.p2 === edge2.p2);
  const swappedPoints = (edge1.p1 === edge2.p2 && edge1.p2 === edge2.p1);
  return samePoints || swappedPoints;
}

function triangulate(points){
  const superTriangle = createSuperTriangle(points);
  let triangulation = [superTriangle];

  for (const point of points){
    // console.log(`Processing point: (${point.x}, ${point.y})`);
    let badTriangles = [];

    for (const triangle of triangulation){
      if (pointInCircumcircle(point, triangle)){
        badTriangles.push(triangle);
      }
    }

    // console.log(`Found ${badTriangles.length} bad triangles`);

    let polygonEdges = [];
    for (const triangle of badTriangles){
      for (const edge of triangle.edges){
        let isShared = false;
        for (const otherTriangle of badTriangles){
          if (triangle === otherTriangle){
            continue;
          }
          for (const otherEdge of otherTriangle.edges){
            if (edgesEqual(edge, otherEdge)){
              isShared = true;
              break;
            }
          }
          if (isShared){
            break;
          }
        }
        if (!isShared){
          polygonEdges.push(edge);
        }
      }
    }
    // console.log(`Found ${polygonEdges.length} polygon edges`);

    if (badTriangles.length > 0 && polygonEdges === 0){
      console.log("ERROR ERROR Bad triangles and no polygon edges?!?!");
    }

    triangulation = triangulation.filter(triangle => !badTriangles.includes(triangle));

    for (const edge of polygonEdges){
      const newTriangle = new Triangle(point, edge.p1, edge.p2);
      triangulation.push(newTriangle);
    }
  }

  console.log(`Finished loop, triangle count before cleanup: ${triangulation.length}`)

  const superVertices = [superTriangle.p1, superTriangle.p2, superTriangle.p3];

  triangulation = triangulation.filter(triangle => {
    const hasSuperVertex =
      superVertices.includes(triangle.p1) ||
      superVertices.includes(triangle.p2) ||
      superVertices.includes(triangle.p3);
    return !hasSuperVertex;
  });

  return triangulation;
}

function isPointInTriangle(point, triangle) {
  const p1 = triangle.p1;
  const p2 = triangle.p2;
  const p3 = triangle.p3;

  // Calculate the sign of the cross product for each edge.
  // This determines which side of the edge the point is on.
  const sign1 = (point.x - p2.x) * (p1.y - p2.y) - (p1.x - p2.x) * (point.y - p2.y);
  const sign2 = (point.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (point.y - p3.y);
  const sign3 = (point.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (point.y - p1.y);

  // If the point is on the same side of all three edges, it's inside.
  const hasNegative = (sign1 < 0) || (sign2 < 0) || (sign3 < 0);
  const hasPositive = (sign1 > 0) || (sign2 > 0) || (sign3 > 0);

  return !(hasNegative && hasPositive);
}

function getTriangleCentroid(triangle) {
  const centerX = (triangle.p1.x + triangle.p2.x + triangle.p3.x) / 3;
  const centerY = (triangle.p1.y + triangle.p2.y + triangle.p3.y) / 3;
  return new Point(centerX, centerY);
}

function drawTriangles(triangles){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;

  for (const triangle of triangles){
    ctx.beginPath();
    ctx.lineTo(triangle.p1.x, triangle.p1.y);
    ctx.lineTo(triangle.p2.x, triangle.p2.y);
    ctx.lineTo(triangle.p3.x, triangle.p3.y);
    ctx.closePath();
    ctx.stroke();
  }
}

function drawColorTriangles(triangles, originalImageData, targetCanvas) {
  const ctx = targetCanvas.getContext('2d');
  targetCanvas.width = originalImageData.width;
  targetCanvas.height = originalImageData.height;
  const imgWidth = originalImageData.width;
  const imgHeight = originalImageData.height;
  const originalData = originalImageData.data;

  const centroids = triangles.map(getTriangleCentroid);
  const colorBuckets = triangles.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const point = new Point(x, y);
      const pixelIndex = (y * imgWidth + x) * 4;
      let triangleFound = false;
      
      for (let i = 0; i < triangles.length; i++) {
        if (isPointInTriangle(point, triangles[i])) {
          const bucket = colorBuckets[i];
          bucket.r += originalData[pixelIndex];
          bucket.g += originalData[pixelIndex + 1];
          bucket.b += originalData[pixelIndex + 2];
          bucket.count++;
          triangleFound = true;
          break;
        }
      }
      if (!triangleFound) {
        let minDistSq = Infinity;
        let closestTriangleIndex = -1;

        for (let i = 0; i < triangles.length; i++) {
          const dx = point.x - centroids[i].x;
          const dy = point.y - centroids[i].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < minDistSq) {
            minDistSq = distSq;
            closestTriangleIndex = i;
          }
        }
        
        if (closestTriangleIndex !== -1) {
            const bucket = colorBuckets[closestTriangleIndex];
            bucket.r += originalData[pixelIndex];
            bucket.g += originalData[pixelIndex + 1];
            bucket.b += originalData[pixelIndex + 2];
            bucket.count++;
        }
      }
    }
  }

  const averageColors = colorBuckets.map((bucket, i) => {
    if (bucket.count === 0) {
      const centroid = centroids[i];
      const px = Math.floor(centroid.x);
      const py = Math.floor(centroid.y);
      const pixelIndex = (py * imgWidth + px) * 4;

      return {
        r: originalData[pixelIndex],
        g: originalData[pixelIndex+1],
        b: originalData[pixelIndex+2]
      }
    };
    return {
      r: Math.round(bucket.r / bucket.count),
      g: Math.round(bucket.g / bucket.count),
      b: Math.round(bucket.b / bucket.count)
    };
  });

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
