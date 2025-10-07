SENSELESS_DIR := senseless-src
.DEFAULT_GOAL := build
.PHONY: all build serve clean

all: build

build:
	@echo "Building Senseless"
	@cd $(SENSELESS_DIR) && npm run build
	@echo "Building Jekyll"
	@JEKYLL_ENV=production bundle exec jekyll build
	@echo "Build complete"

serve:
	@echo "Starting development servers (Jekyll on :4000, React on :3000)..."
	@cd $(REACT_DIR) && npm run serve-all

clean:
	@rm -rf _site
	@rm -rf assets/react-build
	@rm -f _includes/react_senseless_assets.html
	@echo "Cleaning done."
