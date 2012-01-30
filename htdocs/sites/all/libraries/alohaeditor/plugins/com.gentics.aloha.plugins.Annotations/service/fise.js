/**
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Create the Services object. Namespace for Services
 * @hide
 */
if ( !GENTICS.Aloha.Annotations.Services ) GENTICS.Aloha.Annotations.Services = {};

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Annotations.Services.fise = new GENTICS.Aloha.Annotations.Service('com.gentics.aloha.plugins.Annotations.service.fise');

/**
 * init Apache Stanbol Service
 */
GENTICS.Aloha.Annotations.Services.fise.init = function() {
	var that = this;
	
	this.subscribeEvents();
	
	this.ApiEndpoint = false;
	if (GENTICS.Aloha.Annotations.settings.Services && GENTICS.Aloha.Annotations.settings.Services.fise && GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint) {
	   this.ApiEndpoint = GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint;
	}

	if (!this.ApiEndpoint) {
		alert('ERROR: GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint not defined. Configure your Apache Stanbol ApiEndpoint first.');
	}

	this.ResponseFormat = "text/plain";
	this.repositoryName = 'fise/public';
};

/**
 * Subscribe for events
 */
GENTICS.Aloha.Annotations.Services.fise.subscribeEvents = function () {

	var that = this;

	// add the event handler for smartContentChanged / editableDeactivated
	GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableDeactivated', function(event, rangeObject) {

		if (GENTICS.Aloha.activeEditable) {
			var url = false;

			if (GENTICS.Aloha.settings.proxyUrl) {
				// the service url is passed as Query parameter, so it needs to be URLEncoded!
				url = GENTICS.Aloha.settings.proxyUrl + that.ApiEndpoint;
			} else {
				alert('ERROR: GENTICS.Aloha.settings.proxyUrl not defined. Configure your AJAXproxy Plugin.');
			}
			
			jQuery('#edit-body').prepend('<div id="apache-stanbol-info"><b>Sending data to Apache Stanbol ...</b></div>');
			
			data = GENTICS.Aloha.activeEditable.getContents();

			// submit the data to our proxy
			jQuery.ajax({
				type: "POST",
				url: url,
				data: data,
				contentType: 'text/plain',
				cache: false,
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Accept', that.ResponseFormat);
					xhr.setRequestHeader('X-Service-Info', 'Aloha Editor Annotation Service');
				},
				success: function(result) {
					var obj = false;
					
					jQuery('#apache-stanbol-info').fadeOut('slow');
					
					try {
						obj = jQuery.parseJSON(result);
					} catch (e) {
						var re = new RegExp('<title>(.*)<\/title>');
						var match = re.exec(result);
						if (match && match[1]) {
							GENTICS.Aloha.Annotations.log('error', 'Apache Stanbol ERROR: ' + match[1]);
						}
						return false;
					}
					
					var suggestionsContainer = jQuery("input.as-input");
					var suggestions = [];
					var annotations = [];
				    var final_annotations = [];

					try {
						var annotation = {};
						jQuery.each(obj, function(i, val) {
							if (val["http://fise.iks-project.eu/ontology/selected-text"]) {
								//GENTICS.Aloha.Annotations.log(i, val);
								annotation = {
									data: val,
									urn : i,
									type : val["http://purl.org/dc/terms/type"][0]["value"],
									text : val["http://fise.iks-project.eu/ontology/selected-text"][0]["value"],
									confidence : val["http://fise.iks-project.eu/ontology/confidence"][0]["value"]
								};
								suggestions.push(val["http://fise.iks-project.eu/ontology/selected-text"][0]["value"]);
								annotations.push(annotation);
							}
						});

						for (i=0; i < suggestions.length; i++) {
							var term = suggestions[i];
							var context = '#edit-field-tags';
							var termDiv = jQuery(context);
							var termList = termDiv.parent().find('.at-term-list');
							var excludedTermList = [];
					
							term = Drupal.checkPlain(term);
							term = jQuery.trim(term);
							var tags = '';
							var tags_array = [];
							termList.find('.at-term-text').each(function (i) {
								// Get tag and revome quotes to prevent doubling
								var tag = jQuery(this).text().replace(/["]/g, '');
								// Wrap in quotes if tag contains a comma.
								if (tag.search(',') != -1) {
									tag = '"' + tag + '"';
								}
								// Collect tags as a comma seperated list.
								tags = (i == 0) ? tag : tags + ', ' + tag;
								tags_array.push(tag);
							});

							if (term != '' && jQuery.inArray(term, tags_array) < 0 && jQuery.inArray(term, excludedTermList) < 0) {
								termList.append(Drupal.theme('activeTagsTermRemove', term));
								// Wrap in quotes if tag contains a comma.
								if (term.search(',') != -1) {
									term = '"' + term + '"';
								}
								tags = tags + ', ' + term;
								Drupal.attachBehaviors(termList);
								// Set comma seperated tags as value of form field.
								termList.parent().find('input.at-terms').val(tags);
								termList.parent().find('.at-term-entry').val('');
							}
						}
					} catch(m) {
						GENTICS.Aloha.Annotations.log('error: apache stanbol endpoint not available.', m);
					}
				},
				error: function(result) {
					GENTICS.Aloha.Annotations.log('error', 'There was an error fetching the contents of the Apache Stanbol annotation service.');
				}
			});
		}
	});
};