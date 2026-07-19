import yenz from 'eslint-config-yenz'
import globals from 'globals'


export default [
  {
    // Replaces .eslintignore, which flat config no longer reads. node_modules is ignored by default.
    ignores: ['lib/**', 'dist/**', 'coverage/**', 'docs/**']
  },
  {
    files: ['**/*.ts'],
    ...yenz,
    languageOptions: {
      ...yenz.languageOptions,
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      ...yenz.rules,
      // Keep @sx/* (the path alias for ./src) grouped with internal imports rather than treated as
      // an external package. The shared config declares no pathGroups, so this has to be restated in
      // full — `import/order` options are replaced wholesale, not merged.
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@sx/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }]
    }
  },
  {
    files: ['**/*.test.*', 'tests/**'],
    rules: {
      'no-magic-numbers': 'off'
    }
  }
]
