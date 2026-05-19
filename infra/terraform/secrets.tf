resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

resource "random_password" "jwt_refresh_secret" {
  length  = 64
  special = false
}

resource "aws_secretsmanager_secret" "app" {
  name = "${local.name_prefix}/app-secrets"
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    DATABASE_URL       = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.main.endpoint}/shirkat_gah?schema=public&sslmode=require"
    REDIS_URL          = "rediss://${aws_elasticache_replication_group.main.primary_endpoint_address}:6379"
    JWT_SECRET         = random_password.jwt_secret.result
    JWT_REFRESH_SECRET = random_password.jwt_refresh_secret.result
  })

  depends_on = [aws_db_instance.main, aws_elasticache_replication_group.main]
}
