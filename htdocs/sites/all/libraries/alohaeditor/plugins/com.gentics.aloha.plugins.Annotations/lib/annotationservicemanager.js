GENTICS.Aloha.Annotations.AnnotationServiceManager=function(){this.services=[]};
GENTICS.Aloha.Annotations.AnnotationServiceManager.prototype.init=function(){if(GENTICS.Aloha.Annotations.settings.services==undefined)GENTICS.Aloha.Annotations.settings.services={};for(var b=0;b<this.services.length;b++){var a=this.services[b];if(a.settings==undefined)a.settings={};GENTICS.Aloha.Annotations.settings.services[a.serviceId]&&jQuery.extend(a.settings,GENTICS.Aloha.Annotations.settings.services[a.serviceId]);a.init()}};
GENTICS.Aloha.Annotations.AnnotationServiceManager.prototype.register=function(b){if(b instanceof GENTICS.Aloha.Annotations.Service)this.getService(b.serviceId)?GENTICS.Aloha.Log.warn(this,"A service with name { "+b.serviceId+" } already registerd. Ignoring this."):this.services.push(b);else GENTICS.Aloha.Log.error(this,"Trying to register a service which is not an instance of Annotations.AnnotationService.")};
GENTICS.Aloha.Annotations.AnnotationServiceManager.prototype.getService=function(b){for(var a=0;a<this.services.length;a++)if(this.services[a].serviceId==b)return this.services[a];return null};GENTICS.Aloha.Annotations.AnnotationServiceManager=new GENTICS.Aloha.Annotations.AnnotationServiceManager;GENTICS.Aloha.Annotations.AnnotationServiceManager.toString=function(){return"com.gentics.aloha.plugins.Annotations.AnnotationServiceManager"};
