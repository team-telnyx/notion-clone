-- Migration: 000_extensions
-- Description: Enable required PostgreSQL extensions for Notion clone
-- Date: 2024-03-06

-- UUID generation (for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigram similarity for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Hierarchical data types (for block tree paths)
CREATE EXTENSION IF NOT EXISTS "ltree";
