module.exports = {
  'src/**/*.{js,ts}': ['npm run lint', () => 'npm run lint:types'],
};
