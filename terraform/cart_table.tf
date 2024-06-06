resource "aws_dynamodb_table" "cart_table" {
  name = "cart_table"
  billing_mode = "PAY_PER_REQUEST"
    hash_key = "user_id"
    attribute {
        name = "user_id"
        type = "S"
    }
}