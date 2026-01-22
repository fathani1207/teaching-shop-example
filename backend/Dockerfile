FROM python:3.11-slim

WORKDIR /app

# TODO1 
RUN pip install uv

# TODO2
COPY pyproject.toml uv.lock ./

# TODO3
RUN uv sync --frozen

# Install netcat pour la boucle de retry
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*


COPY . .

# TODO4
WORKDIR /app/core

# TODO5
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

# TODO6
ENTRYPOINT ["/entrypoint.sh"]

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY . .

