const LDA = require('./lda');

const docs = [
  ['apple', 'grape', 'banana', 'lemon'],
  ['car', 'plane', 'abc', 'orange'],
  ['bus', 'grape', 'toy', 'watch'],
  ['hot', 'plane', 'toy', 'watch']
];


LDA.run(docs, 3);
