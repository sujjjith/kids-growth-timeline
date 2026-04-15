using 'main.bicep'

param environment = 'dev'
param appName = 'kidchronicle'
param dbAdminLogin = '' // Set via CLI: --parameters dbAdminLogin=<value>
param dbAdminPassword = '' // Set via CLI: --parameters dbAdminPassword=<value>
param containerImageTag = 'latest'
