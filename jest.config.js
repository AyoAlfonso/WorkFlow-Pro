
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
  },
}
