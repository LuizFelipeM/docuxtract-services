up:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml up -d
up-build:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml up -d --build
down:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml down