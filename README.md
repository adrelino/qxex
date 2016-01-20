# qooxdoo-extensions
qooxdoo extensions I developed over the last 5 years.

##setup
```shell
mkdir playground && cd playground
git clone https://github.com/adrelino/qooxdoo-extensions.git
cd qooxdoo-extensions
./init.sh
./generate.py
./generate.py source-server
```

###generate build version and api
```shell
./generate.py build
./generate.py api
```

###deploy to gh-pages
```shell
./deploy.sh build/
./deploy.sh api/
```
