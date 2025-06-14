#!/bin/sh
set -e

echo "🚀 Starting Audio Manager application setup..."

echo "🔄 Waiting for database to be ready..."
# Try to connect to the database with a timeout
MAX_TRIES=30
TRIES=0
until npx prisma db push --skip-generate || [ $TRIES -eq $MAX_TRIES ]; do
  echo "⏳ Waiting for database connection... (attempt $((TRIES+1))/$MAX_TRIES)"
  TRIES=$((TRIES+1))
  sleep 2
done

if [ $TRIES -eq $MAX_TRIES ]; then
  echo "❌ Failed to connect to database after $MAX_TRIES attempts"
  exit 1
fi

echo "✅ Database is ready!"

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma db push

# Seed the database if needed
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  
  # Try to run the seed command
  if npx prisma db seed; then
    echo "✅ Database seeded successfully!"
  else
    echo "⚠️ Database seeding failed, but continuing with application startup..."
  fi
fi

echo "🚀 Starting application..."
exec node server.js 