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

demo:
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin"

demo-permissions:
	mkdir demo
	$(PYTHON) swagger_react_admin_generator/generator.py tests/resources/petstore.yml --output-dir=demo --module-name="A Pet Admin" --permissions

clean-demo:
	rm -rf demo