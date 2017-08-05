function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
                .width(850)
                .height(600);
        };

        reader.readAsDataURL(input.files[0]);
    }
}



(function() {
    "use strict";

    /**
     * Cipher namespace, to store all the cyphers
     *
     * @namespace
     */
    class Cipher{
        constructor(){
            // Surrogate pair limit
            this.bound = 0x10000;
        }

        /**
         * Maps ABCDEF to QWERTY
         *
         * @param {string} text
         * @param {boolean} decode
         *
         * @return {string}
         */

        toQWERTY(text, decode) {
            // ABCDEF to QWERTY map
            let map = {
                a: 'q', b: 'w', c: 'e',
                d: 'r', e: 't', f: 'y',
                g: 'u', h: 'i', i: 'o',
                j: 'p', k: 'a', l: 's',
                m: 'd', n: 'f', o: 'g',
                p: 'h', q: 'j', r: 'k',
                s: 'l', t: 'z', u: 'x',
                v: 'c', w: 'v', x: 'b',
                y: 'n', z: 'm'
            };

            // Flip the map
            if(decode) {
                map = (function() {
                    let tmp = {};
                    let k;

                    // Populate the tmp variable
                    for(k in map) {
                        if(!map.hasOwnProperty(k)) continue;
                        tmp[map[k]] = k;
                    }

                    return tmp;
                })();
            }

            return text.split('').filter(function(v) {
                // Filter out characters that are not in our list
                return map.hasOwnProperty(v.toLowerCase());
            }).map(function(v) {
                // Replace old character by new one
                // And make it uppercase to make it look even fancier
                return map[v.toLowerCase()].toUpperCase();
            }).join('');
        }

        /**
         * Rotate a unicode string
         *
         * @param {string} text
         * @param {int} rotation
         *
         * @return {string}
         */

        rotate(text, rotation) {


            // Force the rotation an integer and within bounds
            rotation = parseInt(rotation) % this.bound;

            // Might as well return the text if there's no change
            if(rotation === 0) return text;

            // Create string from character codes
            return String.fromCharCode.apply(null,
                // Turn string to character codes
                text.split('').map(function(v) {
                    // Return current character code + rotation
                    return (v.charCodeAt() + rotation + this.bound) % this.bound;
                })
            );
        }

        /**
         * Rotate a unicode string using a key
         *
         * @param {string} text
         * @param {string} key
         * @param {boolean} reverse
         *
         * @return {string}
         */

        keyRotate(text, key, reverse) {
            let scope = this;
            // Create string from character codes
            return String.fromCharCode.apply(null,
                // Turn string to character codes
                text.split('').map(function(v, i) {
                    // Get rotation from key
                    let rotation = key[i % key.length].charCodeAt();

                    // Are we decrypting?
                    if(reverse) rotation = -rotation;

                    // Return current character code + rotation
                    return (v.charCodeAt() + rotation + scope.bound) % scope.bound;
                })
            );
        }
    }

    let cipher = new Cipher();



    window.Cipher = cipher;


    document.getElementById('btnEncrypt').addEventListener('click', function() {

        let encryptText = document.getElementById("encryptBox").value;
        if (!document.getElementById("encryptBox").value){
            alert("Field is empty - Please enter value")
        } else {
            let encrypted = cipher.toQWERTY(encrpyptText);
            alert("\""+encryptText+ "\"" + " encrypted is: " +encrypted);
        }
    });

    document.getElementById('btnDecrypt').addEventListener('click', function() {

        let decryptText = document.getElementById("decryptBox").value;
        if (!document.getElementById("decryptBox").value){
            alert("Field is empty - Please enter value")
        } else {
            let decrypted = cipher.toQWERTY(decrpyptText, true);
            alert("\""+decrpyptText+ "\"" + " decrypted is: " +decrypted);
        }
    });

    document.getElementById('btnVigenereEncrypt').addEventListener('click', function() {

        let encryptText = document.getElementById("vigenereBox").value;
        let encryptKey = document.getElementById("vigenereKeyBox").value;
        if (!document.getElementById("vigenereBox").value ){
            alert("Text field is empty - Please enter value")
        }else if(!document.getElementById("vigenereKeyBox").value){
            alert("No key provided - Please enter value")
        } else {
            let encrypted = cipher.keyRotate(encryptText,encryptKey,false)
            alert("\""+encryptText+ "\"" + " encrypted is: " +encrypted);
        }
    });


    document.getElementById('btnVigenereDecrypt').addEventListener('click', function() {

        let encryptText = document.getElementById("dVigenereBox").value;
        let encryptKey = document.getElementById("dVigenereKeyBox").value;
        if (!document.getElementById("dVigenereBox").value ){
            alert("Text field is empty - Please enter value")
        }else if(!document.getElementById("dVigenereKeyBox").value){
            alert("No key provided - Please enter value")
        } else {
            let encrypted = cipher.keyRotate(encryptText,encryptKey,true)
            alert("\""+encryptText+ "\"" + " encrypted is: " +encrypted);
        }
    });


})();