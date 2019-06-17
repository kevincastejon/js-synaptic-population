var Jimp = require('jimp');
const fs = require('fs');
const Population = require('../Population');

const filterTypes = {
  'negative':0,
  'sepia':1,
  'greyScale':2
};

//Change this line to try different filters
const filterType = filterTypes.negative;
// Define a precision cap at witch we'll stop the evolution
const precisionGoal = 0.98;

//
// In this example we will try to make our evolving population learning to apply a filter to a pixel
//

// Init our population rules
const population = new Population({
  demography : 10,            // Number of brains in the population. Default 10.
  eliteDemography : 4,        // Number of brains that will survive natural selection on each generation. Default 4.
  extinctionFitness : null,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  inputs : 3,                 // Number of inputs required to activate brains. Default 2.
  outputs : 3,                // Number of outputs returned from the brains. Default 1.
  hiddenLayers : [8],         // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  mutateRate : 0.02           // Mutation rate from 0 (no mutation) to 1 (full mutation) applied when evolving
});

// Start a fresh population
population.start();

// Define a "lifetime" during which you will activate brains and set their fitness
const numberOfTrainPerGen = 100;

console.log("");
console.log('Evolution started ! Trying to reach '+precisionGoal+' precision. If getting too long stop the program with Ctrl+C');
process.stdout.write("\n");

let averageBestScore = -1;
while (true) {
  // let the current generation experiment life and get the best score of the lifetime
  averageBestScore = experimentLife();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('Generation:'+' '+population.generation+' '+'max score:'+' '+averageBestScore / numberOfTrainPerGen*100+' '+'%');

  // If not reached the precision goal keep evolving the population
  if (averageBestScore / numberOfTrainPerGen < precisionGoal) {
    population.evolve();
  } else {
    break;
  }
}
process.stdout.write("\n");
console.log("");
console.log("Evolution done !");
console.log("");
console.log("Filtering image with best brain of last generation...");
console.log("");

// Sort the population by fitness so we can test the best brain
const sortedPop = population.brains.concat().sort((a, b) => a.fitness < b.fitness);

const pixels = [];
Jimp.read('./imageSource.png',(err, img) => {
  const imageSource = img;
  if (err) {
    console.log(err);
  }
  imageSource.scan(0,0,imageSource.bitmap.width, imageSource.bitmap.height, (x, y, idx) => {
    const r = imageSource.bitmap.data[idx + 0];
    const g = imageSource.bitmap.data[idx + 1];
    const b = imageSource.bitmap.data[idx + 2];
    pixels.push([r,g,b]);
  });
  let it = 0;
  const perfectFilteredImage = imageSource.clone();
  for (let i = 0; i < imageSource.bitmap.height; i++) {
    for (let j = 0; j < imageSource.bitmap.width; j++) {
      const finalTestInputs = pixels[it].map(p => p/255);
      const finalTestOutputs = sortedPop[0].activate(finalTestInputs);
      let finalExpectedOutputs;
        if (filterType === 0) {
          finalExpectedOutputs = negativize(finalTestInputs);
        } else if (filterType === 1) {
          finalExpectedOutputs = sepiaze(finalTestInputs);
        } else if (filterType === 2) {
          finalExpectedOutputs = greyScale(finalTestInputs);
        }
      // console.log('i',finalTestInputs);
      // console.log('o',finalTestOutputs);
      // console.log('s',finalExpectedOutputs);
      imageSource.setPixelColor(Jimp.rgbaToInt(finalTestOutputs[0]*255, finalTestOutputs[1]*255, finalTestOutputs[2]*255, 255),j,i);
      perfectFilteredImage.setPixelColor(Jimp.rgbaToInt(finalExpectedOutputs[0]*255, finalExpectedOutputs[1]*255, finalExpectedOutputs[2]*255, 255),j,i);
      it+=1;
    }
  }
  let outputNameAI;
  if (filterType === 0) {
    outputNameAI = './negativeFilterAI.png';
  } else if (filterType === 1) {
    outputNameAI = './sepiaFilterAI.png';
  } else if (filterType === 2) {
    outputNameAI = './greyScaleFilterAI.png';
  }
  let outputNameAlgo;
  if (filterType === 0) {
    outputNameAlgo = './negativeFilterAlgo.png';
  } else if (filterType === 1) {
    outputNameAlgo = './sepiaFilterAlgo.png';
  } else if (filterType === 2) {
    outputNameAlgo = './greyScaleFilterAlgo.png';
  }
  imageSource.write(outputNameAI, (err) => {
    if (err) {
      console.log(err)
    }
    perfectFilteredImage.write(outputNameAlgo, (err) => {
      if (err) {
        console.log(err)
      }
      console.log("Image fitered by AI");
    });
  });
});

  function experimentLife() {
    let bestScore = -1;
    for (let j = 0; j < numberOfTrainPerGen; j++) {
      // Generate random input
      const inputs = [Math.random(),Math.random(),Math.random()];
      // Deduct expected output based on input
      let expectedOutputs;
      if (filterType === 0) {
        expectedOutputs = negativize(inputs);
      } else if (filterType === 1) {
        expectedOutputs = sepiaze(inputs);
      } else if (filterType === 2) {
        expectedOutputs = greyScale(inputs);
      }
      // And for each brain...
      for (let brainID = 0; brainID < population.demography; brainID++) {
        const brain = population.getBrain(brainID);
        // Get output by activating neurons with input
        const outputs = brain.activate(inputs);
        // Calculate the difference between expected output and real output
        const scores = outputs.map((output, i) => output > expectedOutputs[i] ? 1 - (output - expectedOutputs[i]) : 1 - (expectedOutputs[i] - output));
        // Calculate the score
        const score = scores.reduce((acc, scr) => {
          acc+=scr;
          return acc;
        }, 0)/scores.length;
        // Set the new score to the brain
        brain.fitness+=score;
        // Keep record of the best score
        if (bestScore < brain.fitness) {
          bestScore = brain.fitness;
        }
      }
    }
    // return the best score of the generation lifetime
    return bestScore;
  }
  function negativize(colorFloatArray){
    return [1-colorFloatArray[0],1-colorFloatArray[1],1-colorFloatArray[2]];
  }
  function sepiaze(colorFloatArray){
    const colors = colorFloatArray.map(c => c * 255);
    let tr = 0.393*colors[0] + 0.769*colors[1] + 0.189*colors[2];
    let tg = 0.349*colors[0] + 0.686*colors[1] + 0.168*colors[2];
    let tb = 0.272*colors[0] + 0.534*colors[1] + 0.131*colors[2];

    if( tr > 255 ) {
      tr = 255
    }
    if( tg > 255 ) {
      tg = 255
    }
    if( tb > 255 ) {
      tb = 255
    }

    return [tr/255, tg/255, tb/255];
  }
  function greyScale(colorFloatArray){
    const colors = colorFloatArray.map(c => c * 255);
    let val = (colors[0] + colors[1] + colors[2]) / 3;

    return [val/255, val/255, val/255];
  }
