const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appFlavour: 'Corteza',
  appName: 'one',
  appLabel: 'Corteza One',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-one',
})
