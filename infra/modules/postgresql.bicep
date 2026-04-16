@description('Name of the PostgreSQL server')
param name string

@description('Azure region')
param location string

@description('Administrator login')
@secure()
param adminLogin string

@description('Administrator password')
@secure()
param adminPassword string

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: adminLogin
    administratorLoginPassword: adminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }

  resource db 'databases' = {
    name: 'kidchronicle'
    properties: {
      charset: 'UTF8'
      collation: 'en_US.utf8'
    }
  }

  resource firewallAllowAzure 'firewallRules' = {
    name: 'AllowAzureServices'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
}

output fqdn string = postgres.properties.fullyQualifiedDomainName
output connectionString string = 'postgresql://${adminLogin}:${adminPassword}@${postgres.properties.fullyQualifiedDomainName}:5432/kidchronicle'
