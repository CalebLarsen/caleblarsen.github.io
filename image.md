---
layout: default
---
<div class="center-container">
  <div class="file-selection-wrapper">
    <label for="imageInput" class="custom-file-selection">
      Select Image
    </label>
    <input type="file" id="imageInput" accept="image/*">
  </div>
</div>
<br>
<div id="pipeline-container">
    <div class="pipeline-step">
        <h3>1. Resized Original</h3>
        <canvas id="canvas-original" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>2. Grayscale</h3>
        <canvas id="canvas-grayscale" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>3. Blurred</h3>
        <div class="control-group">
            <label for="blurSigma">Sigma:</label>
            <input type="range" id="blurSigma" min="0.1" max="5" step="0.1" value="0.8">
            <span id="blurValue">0.8</span>
        </div>
        <canvas id="canvas-blurred" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>4. Sobel Edges</h3>
        <canvas id="canvas-sobel" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>5. Thresholded</h3>
        <div id="threshold-controls-wrapper">
            <div class="control-group">
                <label><input type="radio" name="threshold-type" value="niblack" checked> Niblack</label>
                <label><input type="radio" name="threshold-type" value="global"> Global</label>
            </div>
            <div id="niblack-threshold-controls" class="control-group">
                <div>
                    <label for="niblack-size">Window Size:</label>
                    <input type="range" id="niblack-size" min="3" max="51" step="2" value="15">
                    <span id="niblack-size-value">15</span>
                </div>
                <div>
                    <label for="niblack-k">K-value:</label>
                    <input type="range" id="niblack-k" min="-1.0" max="1.0" step="0.05" value="-0.2">
                    <span id="niblack-k-value">-0.2</span>
                </div>
            </div>
            <div id="global-threshold-controls" class="control-group hidden">
                <label for="threshold">Threshold:</label>
                <input type="range" id="threshold" min="1" max="254" step="1" value="100">
                <span id="thresholdValue">100</span>
            </div>
        </div>
        <canvas id="canvas-threshold" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>6. Thinned</h3>
        <canvas id="canvas-thinned" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>7. Sampled Vertices</h3>
        <div class="control-group">
            <label for="maxVertices">Max Vertices:</label>
            <input type="range" id="maxVertices" min="100" max="4000" step="100" value="500">
            <span id="verticesValue">500</span>
        </div>
        <canvas id="canvas-vertices" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>8. Uncolored Triangulation</h3>
        <canvas id="canvas-uncolored" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>9. Colored Triangulation</h3>
        <canvas id="canvas-colored" class="display-panel"></canvas>
    </div>
    <div class="pipeline-step">
        <h3>10. Final Animated Result</h3>
        <div class="control-group">
          <input type="checkbox" id="shuffleCheckbox">
          <label for="shuffleCheckbox">Shuffled Animation</label>
        </div>
        <canvas id="canvas-animated" class="display-panel"></canvas>
    </div>
</div>
<script src='./assets/scripts/image.js'>
</script>
