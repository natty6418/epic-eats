// jest.config.js
module.exports = {
    transform: {
        '\\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-env'] }]
    },
    testEnvironment: 'node',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
};
