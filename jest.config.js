module.exports = {
	transform: {
		'.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
	},
	testEnvironment: 'node',
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
	coverageThreshold: {
		'./src/listen': {
			branches: 70,
			functions: 75,
			lines: 75,
			statements: 75
		},
		'./src/write': {
			branches: 70,
			functions: 75,
			lines: 75,
			statements: 75
		}
	},
	collectCoverageFrom: ['src/*/**.{js,ts}']
}