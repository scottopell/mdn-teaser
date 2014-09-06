var IDEAL_LEN = 20;
var stopWords = [ 'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do',
'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
'what'];

(function($) {
  var fullText = '';
  var keywords = ['default', 'supplied', 'given'];
  var path_parts = window.location.pathname.split('/');
  keywords.push(path_parts[path_parts.length-1])
  keywords.push(path_parts[path_parts.length-2])

  var summary, currentTitle;
  $("article p").each(function(){
    var title = $(this).prev().attr('id');
    if (typeof title !== 'undefined'){
      currentTitle = title;
    }
    if (currentTitle === 'Summary'){
      summary = $(this);
      return;
    }
    var text = this.innerHTML;
    if (text.length > 10 && currentTitle.indexOf('Example') === -1 ){
      fullText += text;
    }
  });
  var flattenedText = flattenHTML(fullText);
  var words = flattenedText.split(' ');
  keywords.push(topItems(words, 2));
  var sentences = flattenedText.split('.').filter(function(sentence){
    return !(sentence === '');
  });
  var ranked = {};

  sentences.sort(function(sentence){ return rankText(sentence, keywords); });
  summary.append('<br><br><h3>IntelliSentences<sup>BETA</sup></h3>');
  sentences.slice(0,4).forEach(function(sentence){
    summary.append('<li>' + sentence + '</li>');
  });

})(jQuery);



function rankText(text, keywords){
  var keywordRank = countAppearances(text, keywords.join(' '));
  var lenRank     = (1 - Math.abs(IDEAL_LEN - text.length) / IDEAL_LEN);
  return keywordRank*1.5 + lenRank;
}

function topItems(array, n){
  var all = {};
  array.forEach(function(item){
    // only want words that aren't command and only contain A-Z and a-z
    if (stopWords.indexOf(item) !== -1 || item.search(/\W/) !== -1){
      return;
    }
    if (typeof all[item] === 'undefined'){
      all[item] = 1;
    } else {
      all[item]++;
    }
  });

  var sortedKeys = Object.keys(all).sort(function(key){
    return all[key];
  });

  var i = 0;
  var topN = [];
  sortedKeys.forEach(function(word){
    i++;
    if (i > n) {return;}
    topN.push(word);
  });
  return topN
}

function countAppearances(haystack, needle){
  var regexp = new RegExp( needle, 'g');
  var match, matches = [];

  while ((match = regexp.exec(haystack)) != null) {
    matches.push(match.index);
  }
  return matches.length;
}

function flattenHTML(text){
  var html = $($.parseHTML(text));
  var type = html[0].tagName;
  if (type == 'CODE'){
    return text;
  }
  if (html.text() == text){
    return text;
  } else {
    return flattenHTML(html.text());
  }
}
