all:
	cd senseless-src && npm run build
	bundle exec jekyll build
