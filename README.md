# js-synaptic-population

A population of neural networks built over (synapticjs)[https://caza.la/synaptic/] using evolution process instead of backpropagation


## Installation

```bash
npm i synaptic-population
```

## Usage

```bash
import Population from 'synaptic-population';        // es6 import
```

or

```bash
const Population = require('synaptic-population');   // classic nodejs require
```

```bash
// Create a population with some optionals rules
const population = new Population({
  demography : 10,            // Number of brains in the population. Default 10.
  eliteDemography : 4,        // Number of brains that will survive natural selection on each generation. Default 4.
  extinctionFitness : null,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  inputs : 1,                 // Number of inputs required to activate brains. Default 2.
  outputs : 1,                // Number of outputs returned from the brains. Default 1.
  hiddenLayers : [8],         // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  mutateRate : 0.2,            // Mutation rate from 0 (no mutation) to 1 (full mutation) applied when evolving
  trainedPop: null            // retrieve a previously exported population (see method toJSON())
});

// Activate brains
pop.activateBrain(brainID, inputs);

// Set fitness of brains
pop.setBrainFitness(brainID, fitness);

// Evolve
pop.evolve();

// And do it again until your population does what you want them to do !
```

See more accurate usages into 'examples' folder

## API

### Properties

- brains : array READ-ONLY                        // Array of neural networks.
- demography : int READ-ONLY,                     // Number of brains in the population. Default 10    .            
- eliteDemography : int READ-ONLY,                // Number of brains that will survive natural selection on each generation. Default 4.
- extinctionFitness : number or null READ-ONLY,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
- generation : int READ-ONLY                      // Number of generation that occurred into the population.
- hiddenLayers : array of int READ-ONLY,          // Array of numbers representing the hidden layers neurons. Default \[8] (one hidden layer of 8 neurons)
- inputs : int READ-ONLY,                         // Number of inputs required to activate brains. Default 1.
- mutateRate : float [0-1]                        // Mutation rate from 0 (no mutation) to 1 (all the children mutates) applied when evolving. Default 0.2.
- mutateFactor : int                              // The degree of mutation applied when mutating a child. Default 3.
- outputs : int READ-ONLY,                        // Number of outputs returned from the brains. Default 1.
- trainedPop: JSON object READ-ONLY               // retrieve a previously exported population (see method toJSON()). Default null.

### Methods

// Create a population with some optionals rules
const population = new Population({
  demography : 10,            // Number of brains in the population. Default 10.
  eliteDemography : 4,        // Number of brains that will survive natural selection on each generation. Default 4.
  extinctionFitness : null,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  inputs : 1,                 // Number of inputs required to activate brains. Default 2.
  outputs : 1,                // Number of outputs returned from the brains. Default 1.
  hiddenLayers : [8],         // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  mutateRate : 0.2,            // Mutation rate from 0 (no mutation) to 1 (full mutation) applied when evolving
  trainedPop: null            // retrieve a previously exported population (see method toJSON())
});

//  Activate a brain neurons with inputs array
- activateBrain(id, inputs)
  id : the brain (individual) ID in your population
  inputs : an inputs array for activating neurons

//  Set the fitness of a brain
- setBrainFitness(id, fitness)
    id : the brain (individual) ID in your population
    fitness : the score to assign to the brain

//  Returns a brain given its ID
- getBrain(id)
    id : the brain (individual) ID in your population

//  Keep the bests, kill the rest and replace them with children of the bests
- evolve()

//  Export the current population into JSON object
- toJSON()
