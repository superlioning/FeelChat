// utils/analyzeSentiment.js
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeMessage(message) {
  const result = sentiment.analyze(message);
  return result;
}