/**
 * COPIED from qx.lang.String.stripTags
 * 
 * Remove HTML/XML tags from a string
 * Example:
 * <pre class='javascript'>qx.lang.String.stripTags("&lt;h1>Hello&lt;/h1>") == "Hello"</pre>
 *
 * @param str {String} string containing tags
 * @return {String} the string with stripped tags
 */
function stripTags(str) {
  return str.replace(/<\/?[^>]+>/gi, "");
}

/**
 * Returns a greater index than matchPos if str contains markup
 */
function indexOfText(str, matchPos){
  var markup = false;
  var cCount = -1;
  for (var i = 0; i < str.length; i++) {
    let c = str[i];
    if(c=="<"){
      markup=true;
    }else if(c==">"){
      markup=false;
    }else if(!markup){
      cCount++;
    }
    if(cCount==matchPos){
      return i;
    }
  }
  return -1;
}

/**
 * Underlines a match in markup. Match was found in stripped text.
 * 
 * @param {string} labelOriginal <b><span>sehr</span> Spannend</b> has children.
 * @param {string} text span can be lowercase
 * @param {number} matchPos from qx.lang.String.stripTags(labelOriginal).toLowerCase().indexOf(text)
 * @return {string} <b><span>sehr</span> <span style='text-decoration:underline'>Span"</span>nend</b> has children.
 */
export function underlineTextInMarkup(labelOriginal, text, matchPos){
  var matchPos2 = indexOfText(labelOriginal, matchPos);
  var labelRich = labelOriginal.substring(0, matchPos2) + 
    "<span style='text-decoration:underline'>" + 
    labelOriginal.substr(matchPos2, text.length) + 
    "</span>" + labelOriginal.substr(matchPos2 + text.length);
  return labelRich;
}

/**
 * Finds needle in HTML Markup haystack, returns underlined string if found.
 * 
 * @param {string} haystack "<b><span>sehr</span> Spannend</b> has children";
 * @param {string} needle span
 * @returns {string|null} null if not found, html markup string if found
 */
export function findAndUnderline(haystack, needle){
  let matchPos = stripTags(haystack).toLowerCase().indexOf(needle);
  if(matchPos>=0){
    return underlineTextInMarkup(haystack, needle, matchPos);
  }else{
    return null;
  }
}
