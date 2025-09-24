all:
	cd caleblarsen/senseless-src && npm run deploy
	cd caleblarsen && bundle exec jekyll build
