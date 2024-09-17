# GUILD

## Step 1

run command: `openssl genrsa -out private_key.pem 2048`

then: `openssl rsa -pubout -in private_key.pem  -out public_key.pem`

## Step 2

Copy/Paste 2 keys to your AWS CloudFront Public Key and Key Group
