const fs = require('fs');
const LDA = require('./lda');

const stopwords = [
"a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be",
"because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "cannot", "could", "did",
"do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", 
"has", "have", "having", "he", "her", "here", "hers", "herself",
"him", "himself", "his", "how", "i", "if", "in", "into", "is",
"it", "its", "itself", "me", "more", "most", "my", "myself", "no", "nor",
"not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
"own", "same", "she",  "should", "so", "some", "such", "than", "that",
"the", "their", "theirs", "them", "themselves", "then", "there", "these", "they",
"this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", 
"were", "what", "when", "where", "which", "while", "who",
"whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
];


const text = fs.readFileSync('./input2.txt', 'utf-8');
text.split('\n').map(strip).forEach(console.log)

const docs = text.split('\n').map(strip).map( d => d.split(' '));


/*
const docs = [
  strip('I like to eat broccoli and bananas.').split(' '),
  strip('I ate a banana and spinach smoothie for breakfast.').split(' '),
  strip('Chinchillas and kittens are cute.').split(' '),
  strip('My sister adopted a kitten yesterday.').split(' '),
  strip('Look at this cute hamster munching on a piece of broccoli.').split(' '),
];
*/



function strip(str) {
  let cleaned = str.toLowerCase();;
  cleaned = cleaned.replace(/'ll/g, '').replace(/'s/g, '').replace(/'t/g, '').replace(/'d/g, '');
  cleaned = cleaned.replace(/'m/g, '').replace(/'ve/g, '').replace(/'re/g, '');
  cleaned = cleaned.replace(/\:p/g, '').replace(/\:\)/g, '').replace(/\:d/g, '');

  cleaned = cleaned.replace(new RegExp('\\b('+stopwords.join('|')+')\\b', 'g'), '');
  cleaned = cleaned.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ').trim();
  return cleaned;
}



[ phi, theta, vocab ] = LDA.run(docs, 2);

console.log('...................');
let humanReadable = 
  phi.map( topic => {
    return topic.map( (term, idx) => {
      return { 
        term: vocab[idx],
        value: term.toFixed(4)
      }
    }).sort( (a, b) => {
      return b.value - a.value;
    }).splice(0, 5);
  });
console.log(humanReadable);

console.log('...................');
// console.log(theta);
