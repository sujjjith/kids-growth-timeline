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

@description('Google OAuth client ID')
param googleClientId string

@description('Google OAuth client secret')
@secure()
param googleClientSecret string

@description('JWT secret for token signing')
@secure()
param jwtSecret string

@description('Comma-separated allowed email addresses')
param allowedEmails string

@description('Azure region for Static Web App (limited availability)')
param swaLocation string = 'eastus2'

@description('Azure region for PostgreSQL Flexible Server (restricted in some regions)')
param pgLocation string = 'centralus'

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
    location: pgLocation
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

// Static Web App (frontend)
module swa './modules/static-web-app.bicep' = {
  name: 'static-web-app'
  params: {
    name: '${resourcePrefix}-web'
    location: swaLocation
  }
}

// Container App Environment + App
module containerApp './modules/container-app.bicep' = {
  name: 'container-app'
  params: {
    name: '${resourcePrefix}-api'
    location: location
    containerRegistryLoginServer: acr.outputs.loginServer
    acrAdminUsername: replace('${resourcePrefix}acr', '-', '')
    acrAdminPassword: listCredentials(resourceId('Microsoft.ContainerRegistry/registries', replace('${resourcePrefix}acr', '-', '')), '2023-07-01').passwords[0].value
    containerImageTag: containerImageTag
    databaseUrl: postgres.outputs.connectionString
    storageConnectionString: storage.outputs.connectionString
    googleClientId: googleClientId
    googleClientSecret: googleClientSecret
    jwtSecret: jwtSecret
    allowedEmails: allowedEmails
    frontendUrl: 'https://${swa.outputs.defaultHostname}'
  }
}

// Outputs
output staticWebAppUrl string = swa.outputs.defaultHostname
output containerAppUrl string = containerApp.outputs.fqdn
output acrLoginServer string = acr.outputs.loginServer
output postgresHost string = postgres.outputs.fqdn
output storageAccountName string = storage.outputs.name
