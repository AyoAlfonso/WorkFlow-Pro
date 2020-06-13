const { environment } = require('@rails/webpacker')
const jquery = require('./plugins/jquery')
const typescript =  require('./loaders/typescript')

environment.loaders.prepend('typescript', typescript)
environment.plugins.prepend('jquery', jquery)
module.exports = environment
