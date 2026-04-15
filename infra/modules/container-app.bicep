@description('Name of the container app')
param name string

@description('Azure region')
param location string

@description('ACR login server')
param containerRegistryLoginServer string

@description('ACR admin username')
@secure()
param acrAdminUsername string

@description('ACR admin password')
@secure()
param acrAdminPassword string

@description('Container image tag (empty string uses quickstart placeholder)')
param containerImageTag string

@description('Database connection URL')
@secure()
param databaseUrl string

@description('Storage connection string')
@secure()
param storageConnectionString string

@description('Google OAuth client ID')
param googleClientId string

@description('Google OAuth client secret')
@secure()
param googleClientSecret string

@description('JWT secret for token signing')
@secure()
param jwtSecret string

@description('Comma-separated list of allowed email addresses')
param allowedEmails string

@description('Frontend URL for CORS and OAuth redirect')
param frontendUrl string

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${name}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource containerAppEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${name}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

var useCustomImage = containerImageTag != 'latest'
var containerImage = useCustomImage ? '${containerRegistryLoginServer}/kidchronicle-api:${containerImageTag}' : 'mcr.microsoft.com/k8se/quickstart:latest'

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: useCustomImage ? 3000 : 80
        transport: 'auto'
      }
      secrets: [
        { name: 'database-url', value: databaseUrl }
        { name: 'storage-connection', value: storageConnectionString }
        { name: 'google-client-secret', value: googleClientSecret }
        { name: 'jwt-secret', value: jwtSecret }
        { name: 'acr-password', value: acrAdminPassword }
      ]
      registries: useCustomImage ? [
        {
          server: containerRegistryLoginServer
          username: acrAdminUsername
          passwordSecretRef: 'acr-password'
        }
      ] : []
    }
    template: {
      containers: [
        {
          name: 'api'
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            { name: 'NODE_ENV', value: 'production' }
            { name: 'PORT', value: '3000' }
            { name: 'DATABASE_URL', secretRef: 'database-url' }
            { name: 'AZURE_STORAGE_CONNECTION_STRING', secretRef: 'storage-connection' }
            { name: 'GOOGLE_CLIENT_ID', value: googleClientId }
            { name: 'GOOGLE_CLIENT_SECRET', secretRef: 'google-client-secret' }
            { name: 'GOOGLE_CALLBACK_URL', value: '${frontendUrl}/auth/callback' }
            { name: 'JWT_SECRET', secretRef: 'jwt-secret' }
            { name: 'JWT_EXPIRY', value: '7d' }
            { name: 'ALLOWED_EMAILS', value: allowedEmails }
            { name: 'FRONTEND_URL', value: frontendUrl }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 2
        rules: [
          {
            name: 'http-scaler'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
        ]
      }
    }
  }
}

output fqdn string = containerApp.properties.configuration.ingress.fqdn
