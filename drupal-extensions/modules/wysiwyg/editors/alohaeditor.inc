<?php
/**
 * @file
 * Editor integration functions for Aloha Editor.
 */

/**
 * Plugin implementation of hook_editor().
 */
 
// @todo search for sites/all/libraries/alohaeditor or alohaeditor plugin path
function wysiwyg_alohaeditor_editor() {
	global $base_url;
	
	$apache_stanbol_url = variable_get('apache_stanbol_url');
	
	drupal_add_js("

GENTICS.Aloha.settings = {
	logLevels: {'error': true, 'warn': true, 'info': false, 'debug': false},
	errorhandling : false,
	ribbon: false,
	proxyUrl: '". $base_url ."/sites/all/libraries/alohaeditor/plugins/com.gentics.aloha.plugins.Annotations/proxy.php?url=',
	'i18n': {
		'current': 'en' 
	},
	'repositories': {
	 	'com.gentics.aloha.repositories.LinkList': {
	 		data: [
 		        { name: 'Semantic CMS', url:'http://semantic-cms.info', type:'website', weight: 0.50 },
 		        { name: 'Aloha Editor - The HTML5 Editor', url:'http://aloha-editor.com', type:'website', weight: 0.90  },
 		        { name: 'IKS Project', url:'http://www.iks-project.eu', type:'website', weight: 0.75  },
 		        { name: 'Apache Stanbol', url:'http://incubator.apache.org/stanbol/', type:'website', weight: 0.75  },
 		        { name: 'Aloha Logo', url:'http://www.aloha-editor.com/images/aloha-editor-logo.png', type:'image', weight: 0.10  }
			]
		}
	},
	'plugins': {
	 	'com.gentics.aloha.plugins.Format': {
		 	// all elements with no specific configuration get this configuration
			config :  [ 'b', 'i', 'p', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat'],
		  	editables : {
				// no formatting allowed for title
				'#title'	: [ ]
		  	}
		},
	 	'com.gentics.aloha.plugins.Table': { 
		 	// all elements with no specific configuration are not allowed to insert tables
			config : [ ]
		},
		'com.gentics.aloha.plugins.Annotations': {
		    'Services' : {
		        'fise' : {
		            ApiEndpoint: '".$apache_stanbol_url."/engines/'
		        },
		        'zemanta' : {
		            ApiEndpoint: 'http://api.zemanta.com/services/rest/0.0/',
		            ApiKey: '".variable_get('zemanta_api_key', false)."',
		            ApiMethod: 'zemanta.suggest_markup'
		        }
		    }
		}
	}
};

jQuery(document).ready(function () { 
	if (typeof GENTICS_Aloha_base == 'undefined') {
		GENTICS_Aloha_base = Drupal.settings.basePath + 'sites/all/libraries/alohaeditor/';
	}
	
});
	",
    array('type' => 'inline', 'scope' => 'header', 'weight' => 5)
    );

  $editor['alohaeditor'] = array(
    'title' => 'Aloha Editor',
    'vendor url' => 'http://www.aloha-editor.com/',
    'download url' => 'https://github.com/alohaeditor/Aloha-Editor',
    'library path' => wysiwyg_get_path('alohaeditor'),
    'libraries' => array(
      'min' => array(
        'title' => 'Minified',
        'files' => array('aloha.js',
        					// default plugins
        					'plugins/com.gentics.aloha.plugins.Format/plugin.js',
        					'plugins/com.gentics.aloha.plugins.List/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Table/plugin.js',
        					// extra plugins
        					'plugins/com.gentics.aloha.plugins.HighlightEditables/plugin.js',
        					'plugins/com.gentics.aloha.plugins.TOC/plugin.js',
        					// link plugin
        					'plugins/com.gentics.aloha.plugins.Link/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Link/LinkList.js',
        					// paste plugin
        					'plugins/com.gentics.aloha.plugins.Paste/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Paste/wordpastehandler.js',
        					// drupal plugin
        					'plugins/org.drupal.aloha.plugins.Drupal/plugin.js',
        					'plugins/org.drupal.aloha.plugins.Drupal/link-repository.js',
        					// semantic annotations plugin
        					'plugins/com.gentics.aloha.plugins.Annotations/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationservicemanager.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationservice.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationwritermanager.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationwriter.js',
        					// semantic services
        					'plugins/com.gentics.aloha.plugins.Annotations/service/fise.js',
        					),
      ),
    ),
    'version callback' => 'wysiwyg_alohaeditor_version',
    'themes callback' => 'wysiwyg_alohaeditor_themes',
    'settings callback' => 'wysiwyg_alohaeditor_settings',
    'plugin callback' => 'wysiwyg_alohaeditor_plugins',
    'versions' => array(
      'nightly' => array(
        'js files' => array('alohaeditor.js'),
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 *
 * @param $editor
 *   An array containing editor properties as returned from hook_editor().
 *
 * @return
 *   The installed editor version.
 */
function wysiwyg_alohaeditor_version($editor) {
  $script = $editor['library path'] . '/VERSION.txt';
  if (!file_exists($script)) {
    return;
  }
  $script = fopen($script, 'r');
  fgets($script);
  $line = fgets($script);
  if (preg_match('([0-9a-zA-Z\.-]+)', $line, $version)) {
    fclose($script);
    return $version[0];
  }
  fclose($script);
}

/**
 * Determine available editor themes or check/reset a given one.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $profile
 *   A wysiwyg editor profile.
 *
 * @return
 *   An array of theme names. The first returned name should be the default
 *   theme name.
 */
function wysiwyg_alohaeditor_themes($editor, $profile) {
  return array('default');
}

/**
 * Return runtime editor settings for a given wysiwyg profile.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $config
 *   An array containing wysiwyg editor profile settings.
 * @param $theme
 *   The name of a theme/GUI/skin to use.
 *
 * @return
 *   A settings array to be populated in
 *   Drupal.settings.wysiwyg.configs.{editor}
 */
function wysiwyg_alohaeditor_settings($editor, $config, $theme) {
  // @todo Setup $library in wysiwyg_load_editor() already.
  $library = (isset($editor['library']) ? $editor['library'] : key($editor['libraries']));
  $settings = array(
    'basePath' => base_path() . $editor['library path'] . '/',
    'jQueryPath' => base_path() . 'misc/jquery.js',
    'updateSelector' => '.form-submit',
    'skin' => $theme,
  );

  if (isset($config['language'])) {
    $settings['lang'] = $config['language'];
  }

  // Add configured buttons.
  $settings['toolsItems'] = array();
  if (!empty($config['buttons'])) {
    $buttoninfo = _wysiwyg_alohaeditor_button_info();
    $plugins = wysiwyg_get_plugins($editor['name']);
    foreach ($config['buttons'] as $plugin => $buttons) {
      foreach ($buttons as $button => $enabled) {
        // Iterate separately over buttons and extensions properties.
        foreach (array('buttons', 'extensions') as $type) {
          // Skip unavailable plugins.
          if (!isset($plugins[$plugin][$type][$button])) {
            continue;
          }

        }
      }
    }
  }

  if (isset($config['css_setting'])) {
    if ($config['css_setting'] == 'theme') {
      // @todo
      //$settings['stylesheet'] = reset(wysiwyg_get_css());
    } else if ($config['css_setting'] == 'self' && isset($config['css_path'])) {
      $settings['stylesheet'] = strtr($config['css_path'], array('%b' => base_path(), '%t' => path_to_theme()));
    }
  }

  return $settings;
}

/**
 * Return internal plugins for this editor; semi-implementation of hook_wysiwyg_plugin().
 */
function wysiwyg_alohaeditor_plugins($editor) {
  $plugins = array(
    'default' => array(
      'buttons' => array(
        // @todo
        /*
        'Bold' => t('Bold'), 'Italic' => t('Italic'),
		'InsertOrderedList' => t('Bullet list'), 'InsertUnorderedList' => t('Numbered list'),
        'Outdent' => t('Outdent'), 'Indent' => t('Indent'),
        'Undo' => t('Undo'), 'Redo' => t('Redo'),
        'CreateLink' => t('Link'), 'Unlink' => t('Unlink'),
        'InsertImage' => t('Image'),
        'Superscript' => t('Superscript'), 'Subscript' => t('Subscript'),
        'ToggleHtml' => t('Source code'),
        'Paste' => t('Paste'),
        'InsertTable' => t('Table'),
        'Preview' => t('Preview'),*/
      ),
      'internal' => TRUE,
    ),
  );
  return $plugins;
}

/**
 * Helper function to provide additional meta-data for internal default buttons.
 */
function _wysiwyg_alohaeditor_button_info() {
  return array(
     // @todo
        /*'Bold' => array('title'=> 'Strong', 'css'=> 'wym_tools_strong'),
        'Italic' => array('title'=> 'Emphasis', 'css'=> 'wym_tools_emphasis'),
    'Superscript' => array('title'=> 'Superscript', 'css'=> 'wym_tools_superscript'),
    'Subscript' => array('title'=> 'Subscript', 'css'=> 'wym_tools_subscript'),
    'InsertOrderedList' => array('title'=> 'Ordered_List', 'css'=> 'wym_tools_ordered_list'),
    'InsertUnorderedList' => array('title'=> 'Unordered_List', 'css'=> 'wym_tools_unordered_list'),
    'Indent' => array('title'=> 'Indent', 'css'=> 'wym_tools_indent'),
    'Outdent' => array('title'=> 'Outdent', 'css'=> 'wym_tools_outdent'),
    'Undo' => array('title'=> 'Undo', 'css'=> 'wym_tools_undo'),
    'Redo' => array('title'=> 'Redo', 'css'=> 'wym_tools_redo'),
    'CreateLink' => array('title'=> 'Link', 'css'=> 'wym_tools_link'),
    'Unlink' => array('title'=> 'Unlink', 'css'=> 'wym_tools_unlink'),
    'InsertImage' => array('title'=> 'Image', 'css'=> 'wym_tools_image'),
    'InsertTable' => array('title'=> 'Table', 'css'=> 'wym_tools_table'),
    'Paste' => array('title'=> 'Paste_From_Word', 'css'=> 'wym_tools_paste'),
    'ToggleHtml' => array('title'=> 'HTML', 'css'=> 'wym_tools_html'),
    'Preview' => array('title'=> 'Preview', 'css'=> 'wym_tools_preview'),
    */
  );
}
