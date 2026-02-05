# Base image - using slim variant for smaller size
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install uv (Python package manager)
RUN pip install uv

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install Python dependencies
RUN uv sync --frozen

# Copy the rest of the application code
COPY . .

# Change to the Django project directory
WORKDIR /app/core

# Copy entrypoint script and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 8000
EXPOSE 8000

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
