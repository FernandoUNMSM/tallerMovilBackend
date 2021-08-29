const sonarqubeScanner = require('sonarqube-scanner')
sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.sources': '.',
      'sonar.tests': 'tests',
      'sonar.host.url': 'http://localhost:9000',
      'sonar.projectKey': 'Backend_3',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx,tests/*.test.js',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      'sonar.login': 'admin',
      'sonar.password': 'HolaMundo'
    }
  }, () => { 
    console.log('sonar is running')
  })
