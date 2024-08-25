# Run the app for production
run:
	docker-compose build && docker-compose up

# Run the app for development
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build && \
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

