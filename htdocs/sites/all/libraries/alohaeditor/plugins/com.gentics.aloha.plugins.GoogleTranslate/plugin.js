GENTICS.Aloha.GoogleTranslate=new GENTICS.Aloha.Plugin("com.gentics.aloha.plugins.GoogleTranslate");GENTICS.Aloha.GoogleTranslate.translateLangs=["en","de","fr"];GENTICS.Aloha.GoogleTranslate.apiKey="AIzaSyBgsTE6JQ5wsgERpi6m2xBY-9pCn2I5zcA";
GENTICS.Aloha.GoogleTranslate.init=function(){var b=this;if(this.settings.apiKey)this.apiKey=this.settings.apiKey;jQuery("head").append('<link rel="stylesheet" href="../plugins/com.gentics.aloha.plugins.GoogleTranslate/css/googleTranslatePlugin.css" />');for(var d=0;d<this.translateLangs.length;d++)GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.continuoustext",new GENTICS.Aloha.ui.Button({iconClass:"GENTICS_button GENTICS_button_googleTranslate_"+b.translateLangs[d],size:"small",onclick:function(e){e=
e.iconCls.replace("GENTICS_button GENTICS_button_googleTranslate_","");b.translate(e)},tooltip:b.translateLangs[d],toggle:false}),"Translate",1)};
GENTICS.Aloha.GoogleTranslate.translate=function(b){for(var d=this,e=GENTICS.Aloha.Selection.getRangeObject().getSelectionTree(),f=[],a,g=0;g<e.length;g++){a=e[g];if(a.selection!="none")if(a.selection=="full")f.push(jQuery(a.domobj).text());else a.selection=="partial"&&f.push(jQuery(a.domobj).text().substring(a.startOffset,a.endOffset))}if(f.length>0){a="";for(g=0;g<f.length;g++)a+="&q="+f[g];jQuery.ajax({type:"GET",dataType:"jsonp",url:"https://www.googleapis.com/language/translate/v2?key="+this.apiKey+
"&target="+b+"&prettyprint=false"+a,success:function(h){if(typeof h.error=="object"){d.log("ERROR","Unable to translate. Error: ["+h.error.code+"] "+h.error.message);return false}h.data&&h.data.translations&&d.applyTranslation(h.data.translations,e)}})}};
GENTICS.Aloha.GoogleTranslate.applyTranslation=function(b,d){for(var e=0,f=0;f<d.length;f++){c=d[f];if(c.selection!="none"){if(c.selection=="full")this.replaceText(c,b[e].translatedText);else if(c.selection=="partial"){var a=jQuery(c.domobj).text(),g=a.substring(0,c.startOffset);a=a.substring(c.endOffset,a.length);this.replaceText(c,g+b[e].translatedText+a)}e++}}};
GENTICS.Aloha.GoogleTranslate.replaceText=function(b,d){if(b.domobj.textContent.substring(0,1)==" ")d=" "+d;if(b.domobj.textContent.substring(b.domobj.textContent.length-1,b.domobj.textContent.length)==" ")d+=" ";b.domobj.nodeType==3?jQuery(b.domobj).replaceWith(document.createTextNode(d)):jQuery(b.domobj).text(d)};
