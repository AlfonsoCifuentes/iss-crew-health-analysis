module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nueva funcionalidad
        'fix',      // Corrección de bug
        'docs',     // Documentación
        'style',    // Cambios de formato
        'refactor', // Refactorización
        'test',     // Añadir tests
        'chore',    // Mantenimiento
        'data',     // Actualización de datos NASA
        'perf',     // Mejoras de performance
        'ci',       // Integración continua
        'build',    // Cambios en build
        'revert'    // Revertir cambios
      ]
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    // Reglas específicas para proyecto NASA
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description: '🚀 A new feature for ISS crew analysis',
            title: 'Features'
          },
          fix: {
            description: '🐛 A bug fix in data processing or UI',
            title: 'Bug Fixes'
          },
          docs: {
            description: '📚 Documentation updates for NASA data sources',
            title: 'Documentation'
          },
          style: {
            description: '💄 Changes that do not affect data processing',
            title: 'Styles'
          },
          refactor: {
            description: '♻️  Code refactoring without data changes',
            title: 'Code Refactoring'
          },
          perf: {
            description: '⚡️ Performance improvements for data analysis',
            title: 'Performance Improvements'
          },
          test: {
            description: '✅ Adding or updating tests for NASA data',
            title: 'Tests'
          },
          build: {
            description: '🔧 Changes to build system or dependencies',
            title: 'Builds'
          },
          ci: {
            description: '⚙️  Changes to CI/CD pipeline',
            title: 'Continuous Integrations'
          },
          chore: {
            description: '🗃️  Other changes that don\'t modify source or test files',
            title: 'Chores'
          },
          data: {
            description: '📊 Updates to NASA data files or processing',
            title: 'Data Updates'
          },
          revert: {
            description: '⏪️ Reverts a previous commit',
            title: 'Reverts'
          }
        }
      },
      scope: {
        description: 'What is the scope of this change (e.g., dashboard, api, data-processing)?'
      },
      subject: {
        description: 'Write a short, imperative tense description of the change'
      },
      body: {
        description: 'Provide a longer description of the change'
      },
      isBreaking: {
        description: 'Are there any breaking changes?'
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
      },
      breaking: {
        description: 'Describe the breaking changes'
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?'
      },
      issuesBody: {
        description: 'If issues are fixed, the commit requires a body. Please enter a longer description of the commit itself'
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)'
      }
    }
  }
};
