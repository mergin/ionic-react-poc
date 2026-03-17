/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['app', 'weather', 'social', 'gallery', 'mocks', 'deps', 'ci', 'release'],
    ],
    'scope-empty': [0],
  },
};
