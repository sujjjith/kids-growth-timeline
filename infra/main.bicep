targetScope = 'resourceGroup'

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Base name for resources')
param appName string = 'kidchronicle'

@description('PostgreSQL administrator login')
@secure()
param dbAdminLogin string

@description('PostgreSQL administrator password')
@secure()
param dbAdminPassword string

@description('Container image tag')
param containerImageTag string = 'latest'

var resourcePrefix = '${appName}-${environment}'

// Container Registry
module acr './modules/container-registry.bicep' = {
  name: 'acr'
  params: {
    name: replace('${resourcePrefix}acr', '-', '')
    location: location
  }
}

// PostgreSQL Flexible Server
module postgres './modules/postgresql.bicep' = {
  name: 'postgresql'
  params: {
    name: '${resourcePrefix}-pg'
    location: location
    adminLogin: dbAdminLogin
    adminPassword: dbAdminPassword
  }
}

// Storage Account (Blob)
module storage './modules/storage.bicep' = {
  name: 'storage'
  params: {
    name: replace('${resourcePrefix}stor', '-', '')
    location: location
  }
}

// Container App Environment + App
module containerApp './modules/container-app.bicep' = {
  name: 'container-app'
  params: {
    name: '${resourcePrefix}-api'
    location: location
    containerRegistryLoginServer: acr.outputs.loginServer
    containerImageTag: containerImageTag
    databaseUrl: postgres.outputs.connectionString
    storageConnectionString: storage.outputs.connectionString
  }
}

// Static Web App (frontend)
module swa './modules/static-web-app.bicep' = {
  name: 'static-web-app'
  params: {
    name: '${resourcePrefix}-web'
    location: location
  }
}

// Outputs
output staticWebAppUrl string = swa.outputs.defaultHostname
output containerAppUrl string = containerApp.outputs.fqdn
output acrLoginServer string = acr.outputs.loginServer
output postgresHost string = postgres.outputs.fqdn
output storageAccountName string = storage.outputs.name
