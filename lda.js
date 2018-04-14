const UNDEF = 'undefined';
const alpha = 2;
const beta = .5;

/* Utility */
const createArray = (x, y) => {
  let r = [];
  if (typeof x !== UNDEF && typeof y !== UNDEF) {
    for (let i=0; i < x; i++) {
      r.push(createArray(y));
    }
  } else if (typeof x !== UNDEF) {
    for (let i=0; i < x; i++) {
      r.push(0);
    }
  }
  return r;
};


/**
 * @param {Array} docs - documents, array of array of indices
 */
const getVocabulary = (docs) => {
  const map = {};
  docs.forEach( doc => {
    doc.forEach( word => {
      map[word] = 1;
    });
  });
  return Object.keys(map);
};


const sample = (m, n, { vocabSize, K, docsIndexed, Z, N_doc_topic, N_word_topic, N_topic_sum, N_doc_sum })  => {
  let tIdx = Z[m][n];
  N_word_topic[docsIndexed[m][n]][tIdx] --;
  N_doc_topic[m][tIdx] --;
  N_topic_sum[tIdx] --;
  N_doc_sum[m] --;


  // Multinomial sampling
  let p = createArray(K);
  for (let k = 0; k < K; k++) {
    p[k] = (N_word_topic[docsIndexed[m][n]][k] + beta) / (N_topic_sum[k] + vocabSize * beta)
      * (N_doc_topic[m][k] + alpha) / (N_doc_sum[m] + K * alpha);
  }

  // Make cumulative
  for (let k = 1; k < K; k++) {
    p[k] += p[k-1];
  }

  const u = Math.random() * p[K-1];
  for (tIdx = 0; tIdx < K; tIdx++) {
    if (u < p[tIdx]) break;
  }

  N_word_topic[docsIndexed[m][n]][tIdx] ++;
  N_doc_topic[m][tIdx] ++;
  N_topic_sum[tIdx]++ 
  N_doc_sum[m] ++;
  Z[m][n] = tIdx;
  console.log('tIdx', tIdx);
};



/**
 * @param {Array} docs - documents, array of array of indices
 * @param {number} K - number of topics to model
 * @param {number} maxIter - maximum number of iterations to run
 */
const run = (docs, K, maxIter = 10) => {
  const docsSize = docs.length;
  const vocab = getVocabulary(docs);
  const vocabSize = vocab.length;


  // Transform to indiced vocab
  const docsIndexed = docs.map( doc => {
    return doc.map( w => {
      return vocab.indexOf(w);
    });
  });

  console.log('Documents:', docsSize);
  console.log('Vocab size:', vocabSize);
  console.log('Indexed:', docsIndexed);


  /* Topic for doc/word */
  const Z = createArray(docsSize);
  const N_doc_topic = createArray(docsSize, K);
  const N_word_topic = createArray(vocabSize, K);
  const N_topic_sum = createArray(K);
  const N_doc_sum = createArray(docsSize);
  

  for (let m=0; m < docsSize; m++) {
    const docSize = docs[m].length;
    Z[m] = createArray(docSize);

    for (let n=0; n < docSize; n++) {
      let tIdx = Math.floor(Math.random() * K);
      Z[m][n] = tIdx;
      N_word_topic[docsIndexed[m][n]][tIdx] ++;
      N_doc_topic[m][tIdx] ++;
      N_topic_sum[tIdx] ++;
    }
    N_doc_sum[m] = docSize;
  }

  console.log('Starting...\n', Z);
  console.log(N_word_topic, N_doc_topic, N_topic_sum, N_doc_sum);
  // Start iterations
  for (let iterIdx = 0; iterIdx < maxIter; iterIdx++) {
    for (let m=0; m < docsSize; m++) {
      for (let n=0; n < docsIndexed[m].length; n++) {
        sample(m, n, {
          vocabSize, 
          K,
          docsIndexed,
          Z,
          N_doc_topic,
          N_word_topic,
          N_topic_sum,
          N_doc_sum
        });
      }
    }
  }

  // Done
  console.log('Done\n', Z);
  console.log('...');
  console.log(N_doc_topic);
};



const LDA = {
  run: run
}


module.exports = LDA;
