output "vpc_id" {
  value = aws_vpc.main.id
}

output "api_url" {
  description = "API base URL — set as NEXT_PUBLIC_API_URL in Vercel"
  value       = var.domain_name != "" ? "https://${var.api_subdomain}.${var.domain_name}" : "http://${aws_lb.api.dns_name}"
}

output "alb_dns_name" {
  value = aws_lb.api.dns_name
}

output "rds_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}

output "s3_bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.assets.domain_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.api.name
}

output "redis_endpoint" {
  value     = aws_elasticache_replication_group.main.primary_endpoint_address
  sensitive = true
}

output "secrets_manager_arn" {
  value = aws_secretsmanager_secret.app.arn
}
