Desktop Skeleton - A qooxdoo Application Template
==================================================

This is a qooxdoo application skeleton which is used as a template. The 
'create-application.py' script (usually under tool/bin/create-application.py)
will use this and expand it into a self-contained qooxdoo application which 
can then be further extended. Please refer to the script and other documentation
for further information.

short:: is a standard qooxdoo GUI application
copy_file:: tool/data/generator/needs_generation.js source/script/custom.js

Manifest.js
    /**
     * following entries only really needed in
     * https://github.com/[adrelino/catalog|qooxdoo-contrib/catalog]/contributions/qooxdoo-extensions/Manifest.json
     * which we should overwrite with this one here on each push so that they stay in sync.
     */
     "download" : "https://github.com/adrelino/qooxdoo-extensions/archive/master.zip",

