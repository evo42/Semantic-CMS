if(!GENTICS.Aloha.Repositories)GENTICS.Aloha.Repositories={};GENTICS.Aloha.Repositories.delicious=new GENTICS.Aloha.Repository("com.gentics.aloha.repositories.delicious");GENTICS.Aloha.Repositories.delicious.settings.username="draftkraft";GENTICS.Aloha.Repositories.delicious.settings.weight=0.35;
GENTICS.Aloha.Repositories.delicious.init=function(){var a=this;if(this.settings.weight+0.15>1)this.settings.weight=0.85;this.deliciousURL="http://feeds.delicious.com/v2/json/";if(this.settings.username){this.deliciousURL+=this.settings.username+"/";this.repositoryName="deliciuos/"+this.settings.username;this.tags=[];jQuery.ajax({type:"GET",dataType:"jsonp",url:"http://feeds.delicious.com/v2/json/tags/"+a.settings.username,success:function(e){for(var b in e)a.tags.push(b)}})}else{this.repositoryName=
"deliciuos/"+popular;this.deliciousURL+="tag/"}};
GENTICS.Aloha.Repositories.delicious.query=function(a,e){var b=this;if(a.objectTypeFilter&&jQuery.inArray("website",a.objectTypeFilter)==-1)e.call(this,[]);else{var d=[];if(this.settings.username)for(var c=a.queryString?a.queryString.split(" "):[],f=0;f<c.length;f++){var i=c[f].trim();if(jQuery.inArray(i,b.tags)==-1){var h=b.tags.filter(function(g){var k=RegExp(i,"i");return g.match(k)});h.length>0&&d.push(h[0])}else d.push(i)}else d=a.queryString.split(" ");c=a.inFolderId?a.inFolderId.split("+"):
[];jQuery.extend(d,c);a.queryString&&d.length==0?e.call(b,[]):jQuery.ajax({type:"GET",dataType:"jsonp",url:b.deliciousURL+d.join("+"),success:function(g){for(var k=[],j=0;j<g.length;j++)typeof g[j]!="function"&&k.push(new GENTICS.Aloha.Repository.Document({id:g[j].u,name:g[j].d,repositoryId:b.repositoryId,type:"website",url:g[j].u,weight:b.settings.weight+0.14}));e.call(b,k)}})}};
GENTICS.Aloha.Repositories.delicious.getChildren=function(a,e){var b=this;if(this.settings.username){var d=[];if(a.inFolderId==this.repositoryId){for(var c=0;c<this.tags.length;c++)typeof this.tags[c]!="function"&&d.push(new GENTICS.Aloha.Repository.Folder({id:this.tags[c],name:this.tags[c],repositoryId:this.repositoryId,type:"tag",url:"http://feeds.delicious.com/v2/rss/tags/"+b.settings.username+"/"+this.tags[c]}));e.call(this,d)}else jQuery.ajax({type:"GET",dataType:"jsonp",url:"http://feeds.delicious.com/v2/json/tags/"+
b.settings.username+"/"+a.inFolderId,success:function(f){var i=[];for(var h in f){var g=a.inFolderId?a.inFolderId+"+"+h:h;typeof f[h]!="function"&&i.push(new GENTICS.Aloha.Repository.Folder({id:g,name:h,repositoryId:b.repositoryId,type:"tag",url:"http://feeds.delicious.com/v2/rss/tags/"+b.settings.username+"/"+g,hasMoreItems:true}))}e.call(b,i)}})}else e.call(this,[])};
GENTICS.Aloha.Repositories.delicious.getObjectById=function(a,e){var b=this;jQuery.ajax({type:"GET",dataType:"jsonp",url:"http://feeds.delicious.com/v2/json/urlinfo/"+jQuery.md5(a),success:function(d){for(var c=[],f=0;f<d.length;f++)typeof d[f]!="function"&&c.push(new GENTICS.Aloha.Repository.Document({id:a,name:d[f].title,repositoryId:b.repositoryId,type:"website",url:a,weight:b.settings.weight+0.14}));e.call(b,c)}})};
