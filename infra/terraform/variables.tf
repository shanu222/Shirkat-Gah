variable "aws_region" {
  description = "AWS region (ap-south-1 recommended for Pakistan proximity)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "shirkat-gah"
}

variable "domain_name" {
  description = "Root domain (e.g. shirkatgah.org)"
  type        = string
  default     = ""
}

variable "api_subdomain" {
  description = "API subdomain"
  type        = string
  default     = "api"
}

variable "vercel_frontend_url" {
  description = "Vercel production URL for CORS (e.g. https://app.shirkatgah.org)"
  type        = string
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "db_allocated_storage" {
  type    = number
  default = 50
}

variable "redis_node_type" {
  type    = string
  default = "cache.t3.micro"
}

variable "ecs_cpu" {
  type    = number
  default = 512
}

variable "ecs_memory" {
  type    = number
  default = 1024
}

variable "ecs_desired_count" {
  type    = number
  default = 2
}

variable "db_username" {
  type    = string
  default = "shirkat_admin"
}
