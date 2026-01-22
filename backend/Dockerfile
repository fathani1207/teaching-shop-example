FROM python:3.11-slim

WORKDIR /app

# TODO1 
RUN pip install uv

# TODO2
COPY pyproject.toml uv.lock ./

# TODO3
RUN uv sync --frozen

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