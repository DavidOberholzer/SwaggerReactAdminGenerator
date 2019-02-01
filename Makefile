VENV=./ve
PYTHON=$(VENV)/bin/python
PIP=$(VENV)/bin/pip

$(VENV):
	virtualenv $(VENV) --python=python3.6

virtualenv: $(VENV)
	$(PIP) install -r requirements.txt

clean-virtualenv:
	rm -rf $(VENV)

test:
	$(VENV)/bin/nosetests --verbose

prettier:
	yarn
	chmod 755 ./prettier.sh
	./prettier.sh

demo: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin"
	make prettier

demo-no-exporter: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --omit-exporter
	make prettier

demo-permissions: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions
	make prettier

demo-permissions-no-exporter: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions --omit-exporter
	make prettier

demo-permissions-store: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions-store
	make prettier

demo-permissions-store-no-exporter: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions-store --omit-exporter
	make prettier

clean-demo:
	rm -rf demo