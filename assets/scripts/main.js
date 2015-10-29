$(document).ready(function(){
        var thePig = document.getElementById( 'thePig' );
        thePig.setAttribute( 'autocomplete', 'off' );

        new StepsForm( thePig, {
          onSubmit : function( form ) {
            var pigla;
            var output;
            var new_phrase = [];
            var vowels = 'YyAaEeIiOoUuÀàÁÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØŠÙÚÛÜÝŸÞßàáâãäåæçèéêëìíîïðñòóôõöøšùúûüýÿþ';
            var vowel_array = vowels.split('');
            var punctuation = ',.:;?!…';
            var punctuation_array = punctuation.split('');
            var hyphen = '';

            var phrase = document.getElementById('to_translate').value;
            if(document.querySelector('.hyphenate').checked === true){hyphen = '-';}

            var word_array = phrase.split(' ');
            var arrayLength = word_array.length;
            for (var i = 0; i < arrayLength; i++) {
              var single_word = word_array[i];
              var k = 0;
              var new_word_end = [];
              var new_word_start = [];
              var new_word_punctuation = '';
              for (var j=0; j < single_word.length; j++) {
                var vowel_test = vowel_array.indexOf(single_word.charAt(j));
                var punctuation_test = punctuation_array.indexOf(single_word.charAt(j));
                if(j === 0 && vowel_test > 1){k=1;pigla='yay';}
                else if(j > 0 && vowel_test > -1){k=1;pigla='ay';}
                else if(j === single_word.length-1 && punctuation_test > -1){k=2;}

                if (k===0){new_word_end.push(single_word.charAt(j)); } else if (k===2){new_word_punctuation=single_word.charAt(j);} else {new_word_start.push(single_word.charAt(j)); }
              }
              var new_single_word = new_word_start.join('') + new_word_end.join('') + hyphen + pigla + new_word_punctuation;
              new_phrase.push(new_single_word);
            }
            output = new_phrase.join(' ');

            var messageEl = thePig.querySelector( '.translated_message' );
            messageEl.innerHTML = output;
            classie.addClass( messageEl, 'show' );
          }
        });
});
