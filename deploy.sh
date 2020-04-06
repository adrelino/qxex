#!/bin/bash
DIR=${1%/} #strips trailing slashes
#echo "This script $0 is called with $# arguments, namely $@"
if [ $# -ne 1 ]
then
	echo "Usage: $0 {folder|file}"
	exit 1
fi

#initally
#git checkout --orphan gh-pages
#git rm -rf .
if [ -e "$DIR" ] #-e file or dir, -f file, -d dir
then
	echo "---- deploying $DIR to gh-pages----";
	git add $DIR -f;
	git stash;
	git checkout gh-pages;
	git checkout stash@{0} -- $DIR;  #TODO: deletes unsaved changes in master
	git commit -m "deploying $DIR";
	git push origin gh-pages; #only push on gh-pages branch, not on master
	git checkout master; #TODO: deletes unsaved changes in master
	echo '---- switched back to master ----';
else
	echo "folder|file $DIR does not exist"
fi