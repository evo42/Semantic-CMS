<?php
// $Id: taxonomy-term.tpl.php,v 1.1 2010/02/10 06:28:10 webchick Exp $

/**
 * @file
 * Default theme implementation to display a term.
 *
 * Available variables:
 * - $name: the (sanitized) name of the term.
 * - $content: An array of items for the content of the term (fields and
 *   description). Use render($content) to print them all, or print a subset
 *   such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $term_url: Direct url of the current term.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the following:
 *   - taxonomy-term: The current template type, i.e., "theming hook".
 *   - vocabulary-[vocabulary-name]: The vocabulary to which the term belongs to.
 *     For example, if the term is a "Tag" it would result in "vocabulary-tag".
 *
 * Other variables:
 * - $term: Full term object. Contains data that may not be safe.
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $page: Flag for the full page state.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the term. Increments each time it's output.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * @see template_preprocess()
 * @see template_preprocess_taxonomy_term()
 * @see template_process()
 */

?>

<div id="taxonomy-term-<?php print $term->tid; ?>" class="<?php print $classes; ?> clearfix">
	<?php if (!$page): ?>
		<h2><a href="<?php print $term_url; ?>"><?php print $term_name; ?></a></h2>
	<?php endif; ?>

	<div class="content">

<?php
	// don't print field sameas
    hide($content['field_sameas']);
    print render($content);

    $row_id = $id-1;

	if (!empty($content['field_sameas']['#items'])) {

	    if ($content['field_sameas']['#items'][$row_id]['safe_value']) {

			$concept_uri = $content['field_sameas']['#items'][$row_id]['safe_value'];

			// display data as ctag
			$ctag = '<div xmlns:ctag="http://commontag.org/ns#" about="'.url('taxonomy/term/'.$term->tid, array('absolute' => true)).'" rel="ctag:tagged">';
			$ctag .= '<span typeof="ctag:Tag" rel="ctag:means" resource="'.$concept_uri.'" />';
			$ctag .= '</div>';
			echo $ctag;

			// fetch metadata from apache stanbol
			$metadata = @file_get_contents(variable_get('apache_stanbol_url').'/entityhub/lookup/?id='.$concept_uri.'&create=true');
			$metadata = json_decode($metadata);

			if (is_object($metadata)) {
				$concept_info = (array) $metadata->representation;
				$concept = (object) false;

				$concept->img_thumbnail = false;
				if (isset($concept_info['http://xmlns.com/foaf/0.1/depiction'])) {
					$concept->img_thumbnail = $concept_info['http://xmlns.com/foaf/0.1/depiction'][0]->value;
				}

				$concept->img_depiction = false;
				if (isset($concept_info['http://xmlns.com/foaf/0.1/depiction'])) {
					$concept->img_depiction = $concept_info['http://xmlns.com/foaf/0.1/depiction'][1]->value;
				}

				$concept->homepage = false;
				if (isset($concept_info['http://xmlns.com/foaf/0.1/homepage'])) {
					$concept->homepage = $concept_info['http://xmlns.com/foaf/0.1/homepage'][0]->value;
				}

				$concept->shortDescription = false;
				if (isset($concept_info['http://www.w3.org/2000/01/rdf-schema#comment'])) {
					$concept->shortDescription = $concept_info['http://www.w3.org/2000/01/rdf-schema#comment'][0]->value;
				}

				$concept->label = false;
				if (isset($concept_info['http://www.iks-project.eu/ontology/rick/model/label'])) {
					$concept->label = $concept_info['http://www.iks-project.eu/ontology/rick/model/label'][0]->value;
				}

				$concept->url_lod_sameAs = false;
				if (isset($concept_info['http://www.w3.org/2002/07/owl#sameAs'])) {
					foreach($concept_info['http://www.w3.org/2002/07/owl#sameAs'] as $page) {
						$concept->url_lod_sameAs[] = $page->value;
					}
				}

				$concept->label = false;
				if (isset($concept_info['http://www.w3.org/2000/01/rdf-schema#label'])) {
					foreach($concept_info['http://www.w3.org/2000/01/rdf-schema#label'] as $label) {
						$label = (array) $label;
						if ($label['xml:lang'] == 'en') {
							$concept->label = $label['value'];
						}
					}
				}

				$concept->page = false;
				if (isset($concept_info['http://xmlns.com/foaf/0.1/page'])) {
					$concept->page = $concept_info['http://xmlns.com/foaf/0.1/page'][0]->value;
				}

				$concept->url_external_pages = false;
				if (isset($concept_info['http://dbpedia.org/ontology/wikiPageExternalLink'])) {
					foreach($concept_info['http://dbpedia.org/ontology/wikiPageExternalLink'] as $page) {
						$concept->url_external_pages[] = $page->value;
					}
				}
				
				$type_mapping = array(	'http://dbpedia.org/ontology/Organisation' => 'http://schema.org/Organization',
										'http://dbpedia.org/ontology/Place' => 'http://schema.org/Place',
										'http://dbpedia.org/ontology/Country' => 'http://schema.org/Country');
				$concept->type = 'Thing';
				if (isset($concept_info['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'])) {
					foreach($concept_info['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] as $type) {
						if (array_key_exists($type->value, $type_mapping)) {
							$concept->type = $type_mapping[$type->value];
						}
					}
				}

				$default = array('id', 
							'http://xmlns.com/foaf/0.1/depiction', 
							'http://xmlns.com/foaf/0.1/homepage', 
							'http://www.w3.org/2000/01/rdf-schema#comment',
							'http://www.iks-project.eu/ontology/rick/model/description',
							'http://www.iks-project.eu/ontology/rick/model/label', 
							'http://www.w3.org/2002/07/owl#sameAs', 
							'http://www.w3.org/2000/01/rdf-schema#label');

				echo '<div id="apache-stanbol-metadata-'.$term->tid.'" class="apache-stanbol-metadata" itemscope itemtype="'.$concept->type.'">';
				if (empty($concept->homepage)) {
					echo '<p><strong><span itemprob="name">'.$concept->label.'</span></strong></p>';
				} else {
					echo '<p><strong>'.l($concept->label, $concept->homepage, array('attributes' => array('itemprob' => 'name'))).'</strong></p>';
				}
				echo '<link itemprop="url" href="'.$concept_uri.'" />';

				if ($concept->img_thumbnail) {
					echo '<img itemprop="image" style="float:left; margin: 10px; max-width: 300px;" class="apache-stanbol-metadata-thumbnail" src="'.$concept->img_thumbnail.'" title="Image: '.$concept->label.'" />';
				}

				if ($concept->shortDescription) {
					echo '<p itemprop="description">'.$concept->shortDescription.'.</p>';
				}

				if ($concept->url_external_pages) {
					echo '<p>On the web: ';
					echo '<ul>';
					foreach($concept->url_external_pages as $page) {
						$page_url = parse_url($page);
						echo '<li>'.l($page_url['host'], $page).'</li>';
					}
					echo '</ul>';
					echo '</p>';
				}

				if ($concept->page) {
					echo '<p>Source: '.l('Wikipedia Article', $concept->page).' about '.$concept->label.'</p>';
				}

				echo '</div>';
			}
		}
		render($content['field_sameas']);
	}
?>
	</div>
</div>
