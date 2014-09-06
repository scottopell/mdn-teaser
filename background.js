(function($) {
  var fullText = '';
  $("article p").each(function(){
    var text = this.innerHTML;
    if (text.length > 40){
      fullText += text;
    }
  });
  console.log(fullText);
  var flattenedText = flattenHTML(fullText);
  var tokenized = flattenedText.split('.');
  console.log(tokenized);
})(jQuery);


function flattenHTML(text){
  var html = $($.parseHTML(text));
  console.log(html.text());
  if (html.text() == text){
    return text;
  } else {
    return flattenHTML(html.text());
  }
}

function rankSentence(sent){
  
}
