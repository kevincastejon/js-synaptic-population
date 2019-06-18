# Evolving population

A population of neural networks built over (synapticjs)[https://caza.la/synaptic/] using evolution process instead of backpropagation


## Installation

```bash
npm i neural-evolving-population
```

## Usage

```bash
import Population from 'neural-evolving-population';

// Init population rules
const pop = new Population({
  demography : 20,          // Number of brains in the population. Default 10    .            
  eliteDemography : 8,      // Number of brains that will survive natural selection on each generation. Default 4.
  extinctionFitness : -100, // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  inputs : 2,               // Number of inputs required to activate brains. Default 1.
  outputs : 2,              // Number of outputs returned from the brains. Default 1.
  hiddenLayers : [6,6],       // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  mutateRate : 0.2          // Mutation rate from 0 (no mutation) to 1 (all the children mutates) applied when evolving
})

// Start a fresh population
pop.start();    // Optionally give a JSON parameter if you previously exported evolved population ( see exportToJSON method )

// Activate brains
pop.activateBrain(brainID, inputs);

// Set fitness of brains
pop.setBrainFitness(brainID, fitness);

// Evolve
pop.evolve();

// And do it again until your population does what you want them to do !
```

## API

### Properties (should be used as READ-ONLY)

- demography : int,                     // Number of brains in the population. Default 10    .            
- eliteDemography : int,                // Number of brains that will survive natural selection on each generation. Default 4.
- extinctionFitness : number or null,   // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
- inputs : int,                // Number of inputs required to activate brains. Default 1.
- outputs : int,               // Number of outputs returned from the brains. Default 1.
- hiddenLayers : array of int,          // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
- mutateRate : float [0-1]              // Mutation rate from 0 (no mutation) to 1 (all the children mutates) applied when evolving
- brains : array                        // Array of neural networks.
- generation : int                      // Number of generation that occurred into the population.
- mutateFactor : int                    // The degree of mutation applied when mutating a child. Default 3.

### Methods

//  Instantiate a population with some options
- constructor(options = null)
  Options object properties :
  - demography : int,                           // Number of brains in the population. Default 10.            
  - eliteDemography : int,                      // Number of brains that will survive natural selection on each generation. Default 4.
  - extinctionFitness : number or null,         // If all brains in a generation get a lower score that this parameter, then all the population is reset. Default null.
  - inputs : int,                               // Number of inputs required to activate brains. Default 1.
  - outputs : int,                              // Number of outputs returned from the brains. Default 1.
  - hiddenLayers : array of int,                // Array of numbers representing the hidden layers neurons. Default [8] (one hidden layer of 8 neurons)
  - mutateRate : float [0-1]                    // Mutation rate from 0 (no mutation) to 1 (all the children mutates) applied when evolving

//  Start a fresh population (create the population)
- start(evolvedPopulation = null)
  Optionally give a JSON parameter if you previously exported evolved population ( see exportToJSON method )

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

//  Keep the best, kill the rest, and replace them with children of the best
- evolve()

//  Export the current population into JSON object
- exportToJSON()
