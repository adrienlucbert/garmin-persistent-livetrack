set dotenv-load := true

# Run the app for production
run:
	just --justfile {{justfile()}} build-up quickstart.yml quickstart-traefik.yml

run-local:
	just --justfile {{justfile()}} build-up quickstart.yml quickstart-local.yml

# Run the app for development
dev:
	just --justfile {{justfile()}} build-up quickstart.yml quickstart-dev.yml quickstart-local.yml

dev-traefik:
	just --justfile {{justfile()}} build-up quickstart.yml quickstart-dev.yml quickstart-traefik.yml

yarn *cmd:
	docker compose -f quickstart.yml -f quickstart-dev.yml exec ui yarn {{cmd}}

build-up *configs:
	docker compose $(for f in {{configs}}; do printf -- "-f %s " "$f"; done) build && \
	docker compose $(for f in {{configs}}; do printf -- "-f %s " "$f"; done) up

# backup the app's data
backup dest="./db.sql.gz":
	docker compose -f quickstart.yml exec postgres pg_dumpall --clean --if-exists --no-password --username=$POSTGRES_USER | gzip > {{ dest }}
