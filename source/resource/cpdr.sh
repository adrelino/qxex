#call as ./cpdr.sh ~/date-holidays/ ~/region-flags/
echo "$1 $2"
cp -t "./qxex/date-holidays/dist" "$1dist/umd.min.js" 
while read -r line; do for file in $line; do echo $file; cp -n "$2pngWx12px/$file.png" "qxex/region-flags/pngWx12px"; done; done < $1regions-and-subregions.txt
