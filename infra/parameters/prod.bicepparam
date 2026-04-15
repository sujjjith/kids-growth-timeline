using '../main.bicep'

param environment = 'prod'
param appName = 'kidchronicle'
param dbAdminLogin = '' // Set via CLI: --parameters dbAdminLogin=<value>
param dbAdminPassword = '' // Set via CLI: --parameters dbAdminPassword=<value>
param containerImageTag = 'latest'
param googleClientId = '' // Set via CLI: --parameters googleClientId=<value>
param googleClientSecret = '' // Set via CLI: --parameters googleClientSecret=<value>
param jwtSecret = '' // Set via CLI: --parameters jwtSecret=<value>
param allowedEmails = '' // Set via CLI: --parameters allowedEmails=<value>
