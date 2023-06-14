az login
$response = az account get-access-token --tenant 1216b2a4-5dee-4c07-82ab-a8c9619707d6

$bearerToken = "Bearer " + ($response | ConvertFrom-Json).accessToken

npm run deploy --bearerToken=$bearerToken
