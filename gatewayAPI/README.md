# Gateway API Service

## Environment Variables

The Gateway API service uses environment variables for configuration, making it easier to deploy in different environments without code changes.

### Required Environment Variables

- `HOST_IP`: IP address for Redis and microservices connections (default: "localhost")

### Setup Instructions

1. Create a `.env` file in the root directory with the required environment variables:
   ```
   HOST_IP=192.168.1.8
   ```

2. The service will automatically load these variables using python-dotenv

### Docker Deployment

The Docker Compose file is configured to use the `.env` file. When running in Docker, you can:

```bash
docker-compose up -d
```

This will load environment variables from the `.env` file automatically.

### Local Development

For local development, ensure you have the `.env` file in the project root with appropriate values.
