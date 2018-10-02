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

demo: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin"

demo-permissions: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions

demo-permissions-store: clean-demo
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions-store

clean-demo:
	rm -rf demo