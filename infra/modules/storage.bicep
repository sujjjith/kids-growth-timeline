@description('Name of the storage account')
param name string

@description('Azure region')
param location string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: name
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }

  resource blobService 'blobServices' = {
    name: 'default'

    resource photosContainer 'containers' = {
      name: 'photos'
      properties: {
        publicAccess: 'None'
      }
    }
  }
}

output name string = storageAccount.name
output connectionString string = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
