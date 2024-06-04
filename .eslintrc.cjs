const baseConfig = require('eslint-config-yenz')

module.exports = {
  ...baseConfig,
  "env": {
    "es2022": true,
    "jest": true,
    "node": true
  },
  "extends": [
    ...baseConfig.extends,
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    ...baseConfig.parserOptions,
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
    ...baseConfig.plugins,
    "@typescript-eslint",
    "perfectionist",
    "@typescript-eslint",
    "import"
  ],
  "rules": {
    ...baseConfig.rules,
    "import/newline-after-import": ["error", {"count": 2}
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@sx/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": [
          "builtin"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  },
  "overrides": [
    {
      files: ["**/*.test.*"], // Test files patterns
      rules: {
        "no-magic-numbers": "off"
      }
    }
  ]
}
