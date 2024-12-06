up:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml up -d
up-build:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml up -d --build
up-build-recreate:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml up -d --build --force-recreate
down:
	docker-compose -f docker-compose.yml -f docker-compose.common.yml down