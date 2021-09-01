'use strict';

const path = require('path');
const argv = require('minimist')(process.argv);
const readFile = require('fs').readFile;
const promisify = require('util').promisify;

const helpArg = argv.help || argv.h;
const fileArg = argv.file || argv.f;
const statsArg = argv.stats || argv.s;
const maxCleanWordsArg = argv.max || argv.m || 4;
const commaChanceArg = argv.comma || argv.c || 5;

const wordsExpression = /[a-zа-яёїієґў'`]+[,.!?]|[A-ZА-ЯЁЇІЄҐЎ]?[a-zа-яёїієґў'`]+,?/g;

if (helpArg) {
  return promisify(readFile)(path.resolve(__dirname, './readme.txt'), {
    encoding: 'utf-8',
  }).then(console.log);
}

return Promise.resolve()
  .then(read)
  .then(sortWords)
  .then(generateRandomSentence)
  .then(speak)
  .catch(console.error);

function read() {
  return promisify(readFile)(getFilePath(), { encoding: 'utf-8' }).then(
    (text) => {
      return text.match(wordsExpression);
    }
  );
}

function speak(text) {
  console.log(text);
}

function sortWords(words) {
  let i, word;
  let capitalized = [];
  let withComma = [];
  let withEnding = [];
  let clean = [];

  for (word of words) {
    if (word.charAt(0).match(/[A-ZА-ЯЁЇІЄҐЎ]/)) {
      capitalized.push(word);
    } else if (word.charAt(word.length - 1).match(/[,]/)) {
      withComma.push(word);
    } else if (word.charAt(word.length - 1).match(/[.?!]/)) {
      withEnding.push(word);
    } else {
      clean.push(word);
    }
  }

  if (statsArg) {
    console.log('Statistics:');
    console.log(capitalized.length + ' capitalized words');
    console.log(withComma.length + ' words with comma');
    console.log(
      withEnding.length + ' words with period, exclamation or question marks'
    );
    console.log(clean.length + ' clean words');
    console.log('');
    console.log(words.length + ' words total');
    console.log('-------');
  }

  return {
    capitalized: capitalized,
    withComma: withComma,
    clean: clean,
    withEnding: withEnding,
  };
}

function generateRandomSentence(sortedWords) {
  let i;
  let sentence = '';
  let shouldContinue = true;
  if (sortedWords.capitalized.length) {
    sentence += getRandomWordFrom(sortedWords.capitalized) + ' ';
  }
  while (shouldContinue) {
    for (i = Math.ceil(Math.random() * maxCleanWordsArg); i > 0; i--) {
      if (sortedWords.clean.length) {
        sentence += getRandomWordFrom(sortedWords.clean) + ' ';
      }
    }

    if (shouldContinue) {
      if (sortedWords.withComma.length) {
        sentence += getRandomWordFrom(sortedWords.withComma) + ' ';
      }
      shouldContinue = Math.random() < getCommaChance();
    }
  }
  if (sortedWords.withEnding.length) {
    sentence += getRandomWordFrom(sortedWords.withEnding);
  }
  return sentence;
}

function getRandomWordFrom(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function getFilePath() {
  if (fileArg) {
    return fileArg[0] === '/' || '~'
      ? fileArg
      : path.resolve(__dirname, fileArg);
  } else {
    return path.resolve(__dirname + '/../books/default.txt');
  }
}

function getCommaChance() {
  return (commaChanceArg > 9 ? 9 : commaChanceArg) / 10;
}
