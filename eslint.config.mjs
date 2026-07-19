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
        ...globals.node
      }
    },
    rules: {
      ...yenz.rules,
      // Resources are built by Object.assign-ing API JSON onto classes whose fields are declared
      // non-optional, so the declared types are more optimistic than what the API actually returns.
      // The rule flags the defensive guards that exist precisely because of that gap — removing them
      // breaks 51 tests. Off until the interfaces model optional fields honestly.
      '@typescript-eslint/no-unnecessary-condition': 'off',
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
    // Scoped here rather than to all **/*.ts so that describe/it/expect in src are still undefined-var errors.
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      'no-magic-numbers': 'off'
    }
  }
]
