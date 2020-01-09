function updateQooxdoo(){
	echo '----qooxdoo-----'
	if [ -d 'qooxdoo' ]
	then
		echo 'using qooxdoo version' &&
		cat 'qooxdoo/version.txt'
		echo ''
	else
		echo 'wget' &&
		wget http://downloads.sourceforge.net/qooxdoo/qooxdoo-5.0.1-sdk.zip && #https://github.com/qooxdoo/qooxdoo/archive/release_5_0_1.zip
		unzip qooxdoo-5.0.1-sdk.zip
		mv qooxdoo-5.0.1-sdk qooxdoo
	fi
}

function updateRepo(){
	echo ----$1'/'$2-----
	if [ -d $2 ]
	then
		echo 'pull' &&
		cd $2 && git pull && cd ..
	else
		echo 'clone' &&
		git clone 'https://github.com/'$1'/'$2'.git'
	fi
}

cd ..;
updateQooxdoo;
#updateRepo 'scro34' 'Bamboo';
#updateRepo 'scro34' 'GraydientTheme';
#updateRepo 'scro34' 'DarkTheme';
#updateRepo 'scro34' 'SilverBlueTheme';
#updateRepo 'scro34' 'Bernstein';
cd 'qooxdoo-extensions';
