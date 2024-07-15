'use strict';

const path = require('path');
const argv = require('minimist')(process.argv);
const fs = require('fs').promises;

const helpArg = argv.help || argv.h;
const fileArg = argv.file || argv.f;
const statsArg = argv.stats || argv.s;
const graphArg = argv.graph || argv.g;

const wordsExpression =
  /[a-zа-яёїієґў'`]+[,.!?]|[A-ZА-ЯЁЇІЄҐЎ]?[a-zа-яёїієґў'`]+,?/g;

(async () => {
  try {
    validateArguments();

    if (helpArg) {
      const helpText = await fs.readFile(
        path.resolve(__dirname, './readme.txt'),
        'utf-8'
      );
      console.log(helpText);
      return;
    }

    const words = await read();
    const { graph, startWords, endWords } = buildGraph(words);

    if (statsArg) {
      printStats(words);
    }

    if (graphArg) {
      console.log(
        'Word Graph:',
        JSON.stringify(Array.from(graph.entries()), null, 2)
      );
      console.log('Start Words:', startWords);
      console.log('End Words:', endWords);
    }

    const randomSentence = generateRandomSentence(graph, startWords, endWords);
    speak(randomSentence);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

function validateArguments() {
  if (fileArg && typeof fileArg !== 'string') {
    throw new Error(
      'Invalid file argument. It should be a string representing the file path.'
    );
  }
  if (statsArg && typeof statsArg !== 'boolean') {
    throw new Error('Invalid stats argument. It should be a boolean.');
  }
  if (graphArg && typeof graphArg !== 'boolean') {
    throw new Error('Invalid graph argument. It should be a boolean.');
  }
}

async function read() {
  const filePath = getFilePath();
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return text.match(wordsExpression);
  } catch (error) {
    throw error;
  }
}

function getFilePath() {
  if (fileArg) {
    return path.isAbsolute(fileArg)
      ? fileArg
      : path.resolve(__dirname, fileArg);
  }
  return path.resolve(__dirname, '../books/default.txt');
}

function buildGraph(words) {
  const graph = new Map();
  const startWords = [];
  const endWords = [];

  words.forEach((word, index) => {
    if (index < words.length - 1) {
      const nextWord = words[index + 1];

      if (!graph.has(word)) {
        graph.set(word, new Map());
      }
      const neighbors = graph.get(word);
      neighbors.set(nextWord, (neighbors.get(nextWord) || 0) + 1);
    }

    if (word.charAt(0).match(/[A-ZА-ЯЁЇІЄҐЎ]/)) {
      startWords.push(word);
    }

    if (word.charAt(word.length - 1).match(/[.?!]/)) {
      endWords.push(word);
    }
  });

  return { graph, startWords, endWords };
}

function generateRandomSentence(graph, startWords, endWords) {
  let sentence = '';
  let word = getRandomWordFrom(startWords);

  sentence += word + ' ';
  let shouldContinue = true;

  while (shouldContinue) {
    const nextWordCandidates = graph.get(word);

    if (!nextWordCandidates) break;

    word = getRandomWordFrom(
      [...nextWordCandidates.entries()].flatMap(([k, v]) => Array(v).fill(k))
    );
    sentence += word + ' ';

    if (endWords.includes(word) || word.charAt(word.length - 1).match(/[.?!]/))
      break;
  }

  if (!endWords.includes(word)) {
    word = getRandomWordFrom(endWords);
    sentence += word;
  }

  return sentence.trim();
}

function getRandomWordFrom(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function speak(text) {
  console.log(text);
}

function printStats(words) {
  const capitalized = words.filter((w) =>
    w.charAt(0).match(/[A-ZА-ЯЁЇІЄҐЎ]/)
  ).length;
  const withComma = words.filter((w) => w.charAt(w.length - 1) === ',').length;
  const withEnding = words.filter((w) =>
    w.charAt(w.length - 1).match(/[.?!]/)
  ).length;
  const clean = words.filter(
    (w) =>
      !w.charAt(0).match(/[A-ZА-ЯЁЇІЄҐЎ]/) &&
      !w.charAt(w.length - 1).match(/[,?!.\-]/)
  ).length;

  console.log('Statistics:');
  console.log(`${capitalized} capitalized words`);
  console.log(`${withComma} words with comma`);
  console.log(`${withEnding} words with period, exclamation or question marks`);
  console.log(`${clean} clean words`);
  console.log('');
  console.log(`${words.length} words total`);
  console.log('-------');
}
