const Population = require('../Population');

//
// In this example we will try to make our evolving population learning to invert a ratio (percentage)
//  Ex --> input : 0.74  expected output : 0.26
//

// Init our population rules
const population = new Population({
  demography : 10,            // Number of brains in the population. Default 10.
  eliteDemography : 4,        // Number of brains that will survive natural selection on each generation. Default 4.
  extinctionFitness : null,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  inputs : 1,                 // Number of inputs required to activate brains. Default 2.
  outputs : 1,                // Number of outputs returned from the brains. Default 1.
  hiddenLayers : [8],         // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  mutateRate : 0.2            // Mutation rate from 0 (no mutation) to 1 (full mutation) applied when evolving
});

// Start a fresh population
population.start();
// Define a precision cap at witch we'll stop the evolution
const precisionGoal = 0.985;

const numberOfTrainPerGen = 100;

console.log("");
console.log('Evolution started ! Trying to reach '+precisionGoal+' precision. If getting too long stop the program with Ctrl+C');
process.stdout.write("\n");

let averageBestScore = -1;
let debugCount = 0;

while (true) {
  // let the current generation experiment life and get the best score of the lifetime
  averageBestScore = experimentLife();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('Generation:'+' '+population.generation+' '+'max score:'+' '+averageBestScore / numberOfTrainPerGen*100+' '+'%');

  // If not reached the precision goal keep evolving the population
  if (averageBestScore / numberOfTrainPerGen < precisionGoal) {
    population.evolve();
    debugCount++;
  } else {
    break;
  }
}
process.stdout.write("\n");
console.log("");
console.log("Evolution done !");
console.log("");
console.log("Testing best brain of last generation with 10 random inputs ...");
console.log("");

// Sort the population by fitness so we can test the best brain
const sortedPop = population.brains.concat().sort((a, b) => a.fitness < b.fitness);

// And let it do some random tests
for (let i = 0; i < 5; i++) {
  const finalTestInput = Math.random();
  const finalTestOutput = sortedPop[0].activate([finalTestInput])[0];
  const diff = finalTestOutput > (1 - finalTestInput) ? finalTestOutput - (1 - finalTestInput) : (1 - finalTestInput) - finalTestOutput;
  console.log(i,'- input:',finalTestInput,'expected:', (1 - finalTestInput), 'output:', finalTestOutput, 'error:', diff);
  console.log("");
}

  function experimentLife() {
    let bestScore = -1;
    for (let j = 0; j < numberOfTrainPerGen; j++) {
      // Generate random input
      const input = Math.random();
      // Deduct expected output based on input
      const expectedOutput = 1 - input;
      // And for each brain...
      for (let brainID = 0; brainID < population.demography; brainID++) {
        const brain = population.getBrain(brainID);
        // Get output by activating neurons with input
        const output = brain.activate([input])[0];
        // Calculate the difference between expected output and real output
        const diff = output > expectedOutput ? output - expectedOutput : expectedOutput - output;
        // Calculate the score
        const score = 1 - diff;
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
