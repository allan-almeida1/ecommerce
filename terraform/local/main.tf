provider "aws" {
  region = "us-east-1"
  endpoints {
    dynamodb = "http://localstack:4566"
  }
  skip_credentials_validation = true
  skip_metadata_api_check = true
  skip_requesting_account_id = true
}