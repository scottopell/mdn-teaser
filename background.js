var IDEAL_LEN = 20;
(function($) {
  var fullText = '';
  var keywords = [];
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
  var sentences = flattenedText.split('.');
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


// Utility functions below
// non-business logic

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
  if (html.text() == text){
    return text;
  } else {
    return flattenHTML(html.text());
  }
}
