GENTICS.Aloha.DragAndDropFiles=new GENTICS.Aloha.Plugin("com.gentics.aloha.plugins.DragAndDropFiles");GENTICS.Aloha.DragAndDropFiles.languages=["en","fr"];GENTICS.Aloha.DragAndDropFiles.config={drop:{max_file_size:2E5,max_file_count:2,upload:{config:{method:"POST",url:"",file_name_param:"filename",file_name_header:"X-File-Name",extra_headers:{},extra_post_data:{},send_multipart_form:false,www_encoded:false}}}};
GENTICS.Aloha.DragAndDropFiles.init=function(){this.setBodyDropHandler();stylePath=GENTICS_Aloha_base+"/plugins/com.gentics.aloha.plugins.DragAndDropFiles/style.css";jQuery('<link rel="stylesheet" />').attr("href",stylePath).appendTo("head");try{this.uploader=this.initUploader(this.settings.config)}catch(a){GENTICS.Aloha.Log.warn(this,a);GENTICS.Aloha.Log.warn(this,"Error creating uploader, no upload will be processed")}};
GENTICS.Aloha.DragAndDropFiles.initUploader=function(a){try{eval(a.drop.upload.uploader_class)}catch(b){GENTICS.Aloha.Log.info(this,"Custom class loading error or not specified, using default")}};
GENTICS.Aloha.DragAndDropFiles.setBodyDropHandler=function(){if(!document.body.BodyDragSinker){document.body.BodyDragSinker=true;var a=this;body=Ext.fly(document.body);body.on({dragenter:function(){return true},dragleave:function(){return true},dragover:function(b){b.stopEvent();return false},drop:function(b){try{if(b.browserEvent.originalEvent.sink){b.stopEvent();return true}var e=b.browserEvent.originalEvent,f=e.dataTransfer.files,d=f.length;if(d<1){e.sink=false;return true}if(d>a.config.drop.max_file_count){GENTICS.Aloha.log.warn(a,
"too much files dropped");b.stopEvent();return true}var c=null;target=jQuery(e.target);if(target.hasClass("GENTICS_editable")){c=target;target=c.children(":last");if(target.hasClass("GENTICS_editable")){c.append("<p> </p>");target=c.children(":last")}}else c=target.parents(".GENTICS_editable");if(c[0]==null)for(;--d>=0;){fileObj=GENTICS.Aloha.Repositories.Uploader.addFileUpload(f[d]);GENTICS.Aloha.Repositories.Uploader.startFileUpload(fileObj.id,this.config.drop.upload.config)}else{GENTICS.Aloha.getEditableById(c.attr("id")).activate();
for(range=a.InitializeRangeForDropEvent(e,c);--d>=0;){if(f[d].size>a.config.drop.max_file_size){b.stopPropagation();GENTICS.Aloha.Log.warn(a,"max_file_size exeeded");return false}fileObj=GENTICS.Aloha.Repositories.Uploader.addFileUpload(f[d]);var g=a.getEditableConfig(c);if(g.drop){GENTICS.Aloha.Repositories.Uploader.startFileUpload(fileObj.id,g.drop.upload.config);jQuery('<div id="'+fileObj.id+'" class="GENTICS_drop_file_box"><div class="GENTICS_drop_file_icon GENTICS_drop_file_default"></div><div class="GENTICS_drop_file_details">'+
f[d].name+"</div></div>");GENTICS.Aloha.EventRegistry.trigger(new GENTICS.Aloha.Event("dropFileInEditable",GENTICS.Aloha,{fileObj:fileObj,range:range,editable:c}))}else{GENTICS.Aloha.EventRegistry.trigger(new GENTICS.Aloha.Event("dropFileInPage",GENTICS.Aloha,f[d]));GENTICS.Aloha.Repositories.Uploader.startFileUpload(fileObj.id,this.config.drop.upload.config)}}}b.stopEvent()}catch(h){GENTICS.Aloha.Log.error(GENTICS.Aloha.DragAndDropFiles,h)}return false}})}};
GENTICS.Aloha.DragAndDropFiles.InitializeRangeForDropEvent=function(a){target=jQuery(a.target);target.textNodes().length==0&&target.html().length==0&&target.html(" ");a=new GENTICS.Aloha.Selection.SelectionRange;if(target.textNodes().length==0){a.startContainer=target[0].childNodes[0];a.endContainer=target[0].childNodes[0]}else{a.startContainer=target.textNodes()[0];a.endContainer=target.textNodes()[0]}a.startOffset=0;a.endOffset=0;try{a.select()}catch(b){GENTICS.Aloha.log(this,b)}return a};
GENTICS.Aloha.DragAndDropFiles.subscribeEvents=function(){var a=this;GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"selectionChanged",function(b,e){if(a.selectedFile!=null)a.selectedFile=null;if(a.findFileObject(e)){GENTICS.Aloha.FloatingMenu.setScope(a.getUID("DragnDrop"));GENTICS.Aloha.FloatingMenu.userActivatedTab=a.i18n("floatingmenu.tab.file")}})};
GENTICS.Aloha.DragAndDropFiles.findFileObject=function(a){if(typeof a=="undefined")a=GENTICS.Aloha.Selection.getRangeObject();try{if(a.getContainerParents().is(".GENTICS_drop_file_box"))return a.getContainerParents().filter(".GENTICS_drop_file_box")}catch(b){GENTICS.Aloha.Log.debug(this,"Error finding fileobj markup.")}return null};
