<?php

set_include_path(get_include_path() . PATH_SEPARATOR . '../lib/');
require_once "EasyRdf.php";


// get metadata
//$uri = 'http://dotnet.local:8080/contenthub/metadata/node-'.$node->nid.'-'.$stanbol_guid;
$uri = 'http://evo42.net/rdf/stanbol.rdf';
$metadata = file_get_contents($uri);

$encoding = mb_detect_encoding($metadata, 'UTF-8', true);
if ($encoding != 'UTF-8') {
	$metadata = utf8_encode($metadata);
}


/*$foaf = new EasyRdf_Graph("http://www.aelius.com/njh/foaf.rdf");
$foaf->load();
$me = $foaf->primaryTopic();
echo "My name is: ".$me->get('foaf:name')."\n";*/

//$metadata = new EasyRdf_Graph('http://dotnet.local:8080/contenthub/metadata/node-'.$node->nid.'-'.$stanbol_guid);
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
EasyRdf_Namespace::set('purl', 'http://purl.org/dc/terms/');
EasyRdf_Namespace::set('stanbol', 'http://fise.iks-project.eu/ontology/');
EasyRdf_Namespace::set('dbpedia', 'http://dbpedia.org/ontology/');

$metadata = new EasyRdf_Graph($uri, $metadata);
$metadata->load();

$resources = false;
$dump = false;
//$resources = $metadata->all('http://www.w3.org/2000/01/rdf-schema#label', 'value');
$resources = $metadata->resources();
//echo 'resources: ';
//print_r($resources);
//die();
$dump = $metadata->dump();

/*
echo('apache stanbolmetadata data: ');
print_r($resources);

echo('apache stanbolmetadata dump: ');
print_r($dump);
*/

echo 'start... ';
echo count($resources).' items... ';

if (is_array($resources)) {
	//watchdog('apache stanbolmetadata json: <pre>'.print_r($resources, true).'</pre>');
	echo 'start resources... ';
	
	$i = 0;
	$annotations = array();
	foreach($resources as $id => $entities) {
		echo 'start <strong>'.$id.'</strong> ... <br />';
		
		/*echo '<pre>';
		print_r($entities);
		echo '</pre>';*/
		$res = $metadata->resource($id);
		
		//print_r($res->dump());
		
		//$confidence = $res->get('stanbol:confidence')->getValue();
		$confidence = $res->get('stanbol:confidence');
		//$label = $res->get('stanbol:entity-label')->getValue();
		//$label = $res->get('stanbol:entity-reference')->getValue();
		$text = $res->get('stanbol:selected-text');
		$label = $res->get('stanbol:entity-label');
		$reference = $res->get('stanbol:entity-reference');
		$type = $res->get('rdf:type');


		if (is_object($label)) {
			//$label = $label->dumpValue();
			$label = $label->getValue();
		}

		if (is_object($confidence)) {
			//$confidence = $confidence->dumpValue();
			$confidence = $confidence->getValue();
		}

		if (is_object($type)) {
			// resource
			$type = $type->dumpValue();
			//$type = $type->label();
		}

		if (is_object($reference)) {
			// resource
			//$reference = $reference->dumpValue();
			$reference = $reference->getUri();
		}

		if (is_object($text)) {
			//$text = $text->dumpValue();
			$text = $text->getValue();
		}


			echo '<pre>label: ';
			print_r($label);
			echo '<br /> ---- <br />confidence: ';
			print_r($confidence);
			echo '<br /> ---- <br />type: ';
			print_r($type);
			echo '<br /> ---- <br />reference: ';
			print_r($reference);
			echo '<br /> ---- <br />text: ';
			print_r($text);
			//print_r($data->get('http://fise.iks-project.eu/ontology/confidence'));
			
			echo '<hr /></pre>';
		
		/*foreach($entities as $entity) {
			echo('apache stanbolentity ' );
			print_r($entity);
			
			$default = array('idhttp://xmlns.com/foaf/0.1/depictionhttp://xmlns.com/foaf/0.1/homepagehttp://www.w3.org/2000/01/rdf-schema#commenthttp://www.iks-project.eu/ontology/rick/model/descriptionhttp://www.iks-project.eu/ontology/rick/model/labelhttp://www.w3.org/2002/07/owl#sameAshttp://www.w3.org/2000/01/rdf-schema#label');
			
			$annotations[$i] = false;
			
			$annotations[$i]['id'] = false;
			$annotations[$i]['reference'] = false;
		    $annotations[$i]['type'] = false;
		    $annotations[$i]['text'] = false;
		    $annotations[$i]['label'] = false;
		    $annotations[$i]['confidence'] = false;
		    
			//$annotations[$i]['urn'] = false;
			foreach($entity as $key => $value) {
			    
				if ($key == 'id') {
					$annotations[$i]['id'] = getRdfText($value);
				}
				
				if ($key == 'http://fise.iks-project.eu/ontology/confidence') {
					$annotations[$i]['confidence'] = getRdfText($value);
				}
				
				if ($key == 'http://fise.iks-project.eu/ontology/entity-label') {
					$annotations[$i]['label'] = getRdfText($value);
				}
				
				if ($key == 'http://fise.iks-project.eu/ontology/selected-text') {
					$annotations[$i]['text'] = getRdfText($value);
				}
				
				if ($key == 'http://fise.iks-project.eu/ontology/entity-reference') {
					$annotations[$i]['reference'] = getRdfText($value);
				}
				
				if ($key == 'http://purl.org/dc/terms/type') {
					$annotations[$i]['type'] = getRdfText($value);
				}
				
				echo ('apache stanbolannotation ' );
				 print_r($annotations[$i]);
				
			}
			$i++;
		}*/
	}
	
	echo('apache stanbolannotations: ');
	print_r($annotations);

	$entities = array();
	foreach($annotations as $key => $entity) {
		if ((int) $entity['confidence'] >= 0) {
		//if ((int) $entity['confidence'] >= 0 && !empty($entity['type'])) {
			$entities[strtolower(md5($entity['label']))] = $entity;
			//$entities[strtolower(md5($entity['text']))] = $entity;
		}
	}
	
	echo('apache stanbolentities: ');
	print_r($entities);

}
