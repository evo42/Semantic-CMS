<?php
    /**
     * Fetch and information about villages in Fife from dbpedia.org
     *
     * @package    EasyRdf
     * @copyright  Copyright (c) 2009-2011 Nicholas J Humfrey
     * @license    http://unlicense.org/
     */

    set_include_path(get_include_path() . PATH_SEPARATOR . '../lib/');
    require_once "EasyRdf.php";
    require_once "html_tag_helpers.php";

    $LANG = 'en';
    EasyRdf_Namespace::set('dbowl', 'http://dbpedia.org/ontology/');
    EasyRdf_Namespace::set('dbpprop', 'http://dbpedia.org/property/');
    EasyRdf_Namespace::set('dbpedia', 'http://dbpedia.org/resource/');
?>
<html>
<head><title>Village Info</title></head>
<body>
<h1>Village Info</h1>

<?php
    if (isset($_REQUEST['term'])) {
        $uri = "http://dbpedia.org/resource/".$_REQUEST['term'];
        $graph = new EasyRdf_Graph( $uri );
        $graph->load();

        $village = $graph->resource($uri);
        print content_tag('h2',$village->label($LANG));

        if ($village->get('foaf:depiction')) {
            print image_tag($village->get('foaf:depiction'),
              array('style'=>'max-width:400px;max-height:250px;'));
        }

        print content_tag('p',$village->get('rdfs:comment',$LANG));

        if ($village->get('geo:long')) {
            $ll = $village->get('geo:lat').','.$village->get('geo:long');
            print "<iframe width='425' height='350' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://maps.google.com/maps?f=q&amp;sll=$ll&amp;output=embed'></iframe>";
        }

        echo "<br /><br />";
        echo $graph->dump();
    } else {
        $uri = "http://dbpedia.org/resource/Category:Villages_in_Fife";
        $graph = new EasyRdf_Graph( $uri );
        $graph->load();
        $category = $graph->resource($uri);

        print "<ul>\n";
        foreach ($category->all('^dc:subject') as $resource) {
            $term = str_replace('http://dbpedia.org/resource/','',$resource);
            $label = urldecode(str_replace('_',' ',$term));
            print '<li>'.link_to_self($label, 'term='.$term)."</li>\n";
        }
        print "</ul>\n";
    }
?>
</body>
</html>
