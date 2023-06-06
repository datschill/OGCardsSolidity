const ENSReverseRegistrar = require('./ENS/ReverseRegistrar.json')
const ENSRegistryWithFallback = require('./ENS/ENSRegistryWithFallback.json')
const ENSReverseResolver = require('./ENS/ReverseResolver.json')

let abis = {
    ENSReverseRegistrar,
    ENSRegistryWithFallback,
    ENSReverseResolver
}

module.exports = abis