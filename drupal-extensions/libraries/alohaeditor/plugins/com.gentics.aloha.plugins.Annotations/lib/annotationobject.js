GENTICS.Aloha.Annotations.Annotation=function(a,b){this.namespaces=b;if(this.attrs=a)try{this.rel=this.getAttr("rel");this.rev=this.getAttr("rev");this.content=this.getAttr("content");this.href=this.getAttr("href");this.src=this.getAttr("src");this.about=this.getAttr("about");this.property=this.getAttr("property");this.resource=this.getAttr("resource");this.datatype=this.getAttr("datatype");this.type=this.getAttr("type")}catch(d){throw d;}};
GENTICS.Aloha.Annotations.Annotation.prototype.getAttr=function(a){var b=this.attrs[a];if(jQuery.inArray(a,["rel","rev","property","type"])){a=b.split(" ");for(var d=true,e=true,c=0;c<a.length;c++){if(isCURIE(a[c].trim()))checkNamespace(a[c].trim())||(e=false);else d=false;this.isCURIE(a[c].trim())}if(d){if(!e)throw"Invalid namespace: "+b;}else throw"No CURIE: "+b;}else if(a=="datatype")if(isCURIE(b)){if(!checkNamespace(b))throw"Invalid namespace: "+b;}else throw"No CURIE: "+b;else if(jQuery.inArray(a,
["about","resource"])){if(!isURI(b))if(isSafeCURIE(b)){if(!checkNamespace(b))throw"Invalid namespace: "+b;}else throw"No URIorSafeCURIE: "+b;}else if(jQuery.inArray(a,["href","src"]))if(!isURI(b))throw"No URI: "+b;return value};GENTICS.Aloha.Annotations.Annotation.prototype.isCURIE=function(a){return a.match(/(([i-[:]][c-[:]]*)?:)?.+/)};GENTICS.Aloha.Annotations.Annotation.prototype.isSafeCURIE=function(a){return a.match(/[(([i-[:]][c-[:]]*)?:)?.+]/)};
GENTICS.Aloha.Annotations.Annotation.prototype.isURI=function(a){var b=RegExp("^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(d*))?)(((/(?:[^?#](?![^?#/]*.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))(?:?([^#]*))?(?:#(.*))?)");return a.match(b)};GENTICS.Aloha.Annotations.Annotation.prototype.checkNamespace=function(a){a=a.split(":");if(a.length==2)for(var b=0;b<this.namespaces;b++)if(this.namespaces[b].prefix==a[0])return true;return false};
