const synaptic = require('synaptic');

class Population {
  constructor(options) {
    this.demography = options.demography || 10;
    this.eliteDemography = options.eliteDemography || 4;
    this.extinction = options.extinction !== undefined ? options.extinction : null;
    this.extinctions = 0;
    this.inputs = options.inputs || 2;
    this.outputs = options.outputs || 2;
    this.hiddenLayers = options.hiddenLayers || [8];
    this.mutateRate = options.mutateRate || 0.2;
    if (this.demography < this.eliteDemography) this.eliteDemography = this.demography;
    this.brains = [];
    this.generation = 1;
  }

  create(pTrainedPop = null) {
    const trainedPop = pTrainedPop || { generation: 1, pop: [] };
    this.brains = [];
    this.generation = trainedPop.generation;

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

  evolve() {
    this.brains.sort((a, b) => a.fitness < b.fitness);
    if (this.extinction !== null && this.brains[0].fitness < this.extinction) {
      const tempRate = this.mutateRate;
      this.mutateRate = 1;
      this.create();
      this.mutateRate = tempRate;
      this.extinctions += 1;
    } else {
    // fill the rest of the next population with new units using crossover and mutation
      for (let i = 0; i < this.demography; i += 1) {
        if (i >= this.eliteDemography) {
        // Replace the loosers
          let offspring;

          if (i === this.eliteDemography) {
          // offspring is made by a crossover of two best winners
            offspring = Population.crossOver(this.brains[0].toJSON(), this.brains[1].toJSON());
          } else if (i > this.eliteDemography) {
          // offspring is made by a crossover of two random winners
            const randomCouple = this.brains.concat().sort(() => Math.random() > 0.5).splice(0, 2);
            offspring = Population.crossOver(randomCouple[0].toJSON(), randomCouple[1].toJSON());
          }
          // mutate the offspring
          offspring = this.mutation(offspring);
          // create a new unit using the neural network from the offspring
          const newBrain = synaptic.Network.fromJSON(offspring);
          // newBrain.fitness = 0;
          this.brains[i] = newBrain;
        }
        this.brains[i].fitness = 0;
      }
      this.generation += 1;
    }
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
      const mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
      gene *= mutateFactor;
    }
    return gene;
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getRandomUnit(array) {
    return array[Population.random(0, array.length - 1)];
  }
}
export default Population;
