/**
 * Created by jamie on 18/05/2014.
 */
define(function () {

    return {

        /**
         * thisIsCamelCase
         * @returns {XML|string}
         */
        camelCase: function(str){
            str = str
                .replace(/[\-_]/g, ' ') //convert all hyphens and underscores to spaces
                .replace(/\s[a-z]/g, this.upperCase) //convert first char of each word to UPPERCASE
                .replace(/\s+/g, '') //remove spaces
                .replace(/^[A-Z]/g, this.lowerCase); //convert first char to lowercase
            return str;
        },


        /**
         * ThisIsPascalCase
         */
        pascalCase: function(str){
            return this.camelCase(str).replace(/^[a-z]/, this.upperCase);
        },


        /**
         * This Is Proper Case
         * @param str
         * @returns {XML|string|void}
         */
        properCase: function(str){
            return this.lowerCase(str).replace(/^\w|\s\w/g, this.upperCase);
        },


        /**
         * This is sentence case
         * @param str
         * @returns {XML|string|void}
         */
        sentenceCase: function(str){
            return this.lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, this.upperCase);
        },


        lowerCase: function(str){
            return str.toLowerCase();
        },


        upperCase: function(str){
            return str.toUpperCase();
        },


        trim: function(str, chars){
            return this.ltrim(this.rtrim(str, chars), chars);
        },


        ltrim: function(str, chars) {
            var start = 0,
                len = str.length,
                charLen = chars.length,
                found = true,
                i, c;

            while (found && start < len) {
                found = false;
                i = -1;
                c = str.charAt(start);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        start++;
                        break;
                    }
                }
            }

            return (start >= len) ? '' : str.substr(start, len);
        },

        /**
         * @param str
         * @param val
         * @returns {boolean}
         */
        contains: function(str, val){
            return str.indexOf(val) != -1;
        }



    };

});