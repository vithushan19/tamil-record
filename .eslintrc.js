module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // --- Rules already disabled or set to warn ---
    'no-unused-vars': 'off',
    'no-console': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // --- Additional rules to disable common errors ---
    // Disable TypeScript's rule for unused vars if you prefer to rely on the compiler
    '@typescript-eslint/no-unused-vars': 'off',
    
    // Common Next.js rules that are often turned off for flexibility
    '@next/next/no-img-element': 'off',
    '@next/next/no-html-link-for-pages': 'off',

    // React Hooks rule – often set to 'warn' or 'off' if you have other checks
    'react-hooks/exhaustive-deps': 'warn', // or 'off'

    // TypeScript rule for 'any' – often disabled in legacy or mixed codebases
    '@typescript-eslint/no-explicit-any': 'off',

    // Disable the core 'no-undef' rule as TypeScript handles this better
    'no-undef': 'off',

    // --- Sort rules (kept as warnings) ---
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^@?\\w', '^\\u0000'],
          ['^.+\\.s?css$'],
          ['^@/lib', '^@/hooks'],
          ['^@/data'],
          ['^@/components'],
          ['^@/'],
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'],
          ['^'],
        ],
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
};