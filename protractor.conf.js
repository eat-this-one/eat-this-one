exports.config = {

  capabilities: {
      'browserName': 'chrome'
  },
  specs: ['test/e2e/**/*.js'],
  baseUrl: 'http://localhost:8000/'
};
