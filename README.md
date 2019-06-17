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
  mutateRate : 0.2          // Mutation rate from 0 (no mutation) to 1 (full mutation) applied when evolving
})

// Start a fresh population
pop.start();    // Optionally give a json parameter if you previously exported evolved population ( see exportToJSON method )

// Activate brains
pop.activateBrain(brainID, input);

// Set fitness of brains
pop.setBrainFitness(brainID, fitness);

// Evolve
pop.evolve();

// And do it again until your population does what you want them to do !
```
