@description('Name of the static web app')
param name string

@description('Azure region')
param location string

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/frontend'
      outputLocation: 'dist'
    }
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output name string = staticWebApp.name
