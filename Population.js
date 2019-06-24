const synaptic = require('synaptic');

class Population {
  constructor(options = {}) {
    this.demography = options.demography !== undefined ? options.demography : 10;
    this.eliteDemography = options.eliteDemography !== undefined ? options.eliteDemography : 4;
    this.extinctionFitness = options.extinction !== undefined ? options.extinction : null;
    this.extinctionCount = 0;
    this.inputs = options.inputs !== undefined ? options.inputs : 1;
    this.outputs = options.outputs !== undefined ? options.outputs : 1;
    this.hiddenLayers = options.hiddenLayers !== undefined ? options.hiddenLayers : [8];
    this.mutateRate = options.mutateRate !== undefined ? options.mutateRate : 0.2;
    const trainedPop = (options.trainedPop !== undefined && options.trainedPop !== null) ? options.trainedPop : { generation: 1, pop: [] };
    if (this.demography < this.eliteDemography) this.eliteDemography = this.demography;
    this.brains = [];
    this.generation = 1;
    this.mutateFactor = 3;
    for (let i = 0; i < this.demography; i += 1) {
      const newBrain = trainedPop.pop[i]
        ? synaptic.Network.fromJSON(trainedPop.pop[i])
        : new synaptic.Architect.Perceptron(this.inputs, ...this.hiddenLayers, this.outputs);

      const jsonBrain = newBrain.toJSON();
      const mutatedBrain = synaptic.Network.fromJSON(this.mutation(jsonBrain));
      mutatedBrain.fitness = 0;
      this.brains.push(mutatedBrain);
    }
  }

  reset() {
    this.brains = [];
    this.generation = 1;

    for (let i = 0; i < this.demography; i += 1) {
      const newBrain = new synaptic.Architect.Perceptron(this.inputs, ...this.hiddenLayers, this.outputs);
      const jsonBrain = newBrain.toJSON();
      const mutatedBrain = synaptic.Network.fromJSON(this.mutation(jsonBrain));
      mutatedBrain.fitness = 0;
      this.brains.push(mutatedBrain);
    }
  }

  activateBrain(id, inputs) {
    return this.brains[id].activate(inputs);
  }

  setBrainFitness(id, fitness) {
    this.brains[id].fitness = fitness;
  }

  getBrain(id) {
    return this.brains[id];
  }

  evolve() {
    this.brains.sort((a, b) => a.fitness < b.fitness);
    if (this.extinctionFitness !== null && this.brains[0].fitness < this.extinctionFitness) {
      const tempRate = this.mutateRate;
      this.mutateRate = 1;
      this.start();
      this.mutateRate = tempRate;
      this.extinctionCount += 1;
    } else {
    // fill the rest of the next population with new units using crossover and mutation
      for (let i = 0; i < this.demography; i += 1) {
        if (i >= this.eliteDemography) {
        // Replace the loosers
          let offspring;

          if (i < ((this.demography- this.eliteDemography)/2)+this.eliteDemography) {
            // console.log('first non-elite', i);
          // offspring is made by a crossover of two best winners
            offspring = Population.crossOver(this.brains[0].toJSON(), this.brains[1].toJSON());
          } else {
            // console.log('rest non-elite', i);
          // offspring is made by a crossover of two random winners
            const randomCouple = this.brains.concat().splice(0, this.eliteDemography).sort(() => Math.random() > 0.5).splice(0, 2);
            offspring = Population.crossOver(randomCouple[0].toJSON(), randomCouple[1].toJSON());
          }
          // mutate the offspring
          offspring = this.mutation(offspring);
          // create a new unit using the neural network from the offspring
          const newBrain = synaptic.Network.fromJSON(offspring);
          // newBrain.fitness = 0;
          this.brains[i] = newBrain;
        } else {
          // console.log('elite', i);
        }
        this.brains[i].fitness = 0;
      }
      this.generation += 1;
    }
  }

  toJSON(){
    return this.brains.map(b => b.toJSON());
  }
  // performs a single point crossover between two parents
  static crossOver(parentA, parentB) {
    const pA = parentA;
    const pB = parentB;
    // get a cross over cutting point
    const cutPoint = Population.random(0, pA.neurons.length - 1);

    // swap 'bias' information between both parents:
    // 1. left side to the crossover point is copied from one parent
    // 2. right side after the crossover point is copied from the second parent
    for (let i = cutPoint; i < pA.neurons.length; i += 1) {
      const biasFromParentA = pA.neurons[i].bias;
      pA.neurons[i].bias = pB.neurons[i].bias;
      pB.neurons[i].bias = biasFromParentA;
    }

    return Population.random(0, 1) === 1 ? pA : pB;
  }

  // performs random mutations on the offspring
  mutation(pOffspring) {
    const offspring = pOffspring;
    // mutate some 'bias' information of the offspring neurons
    for (let i = 0; i < offspring.neurons.length; i += 1) {
      offspring.neurons[i].bias = this.mutate(offspring.neurons[i].bias);
    }

    // mutate some 'weights' information of the offspring connections
    for (let i = 0; i < offspring.connections.length; i += 1) {
      offspring.connections[i].weight = this.mutate(offspring.connections[i].weight);
    }

    return offspring;
  }

  // mutates a gene
  mutate(pGene) {
    let gene = pGene;
    if (Math.random() < this.mutateRate) {
      // console.log('before:', gene);
      // const factor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
      const factor = (Math.random() * this.mutateFactor*2)-this.mutateFactor/2;
      gene *= factor;
      // console.log('mutated:', gene  );
    }
    return gene;
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
module.exports = Population;
