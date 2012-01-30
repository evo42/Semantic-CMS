<?php
    /**
     * Display the basic information in a FOAF document
     *
     * The example starts by loading the requested FOAF document
     * from the web. It then tries to work out if the URI given
     * was for the person or the document about the person.
     *
     * If a person is found, then the person's name, homepage
     * and description are shown, along with a list of the
     * person's friends.
     *
     * @package    EasyRdf
     * @copyright  Copyright (c) 2009-2011 Nicholas J Humfrey
     * @license    http://unlicense.org/
     */

    set_include_path(get_include_path() . PATH_SEPARATOR . '../lib/');
    require_once "EasyRdf.php";
    require_once "html_tag_helpers.php";
?>
<html>
<head><title>FOAF Info</title></head>
<body>
<h1>FOAF Info</h1>

<?= form_tag() ?>
<?= text_field_tag('uri', 'http://www.aelius.com/njh/foaf.rdf', array('size'=>50)) ?>
<?= submit_tag() ?>
<?= form_end_tag() ?>

<?php
    if (isset($_REQUEST['uri'])) {
        $graph = new EasyRdf_Graph($_REQUEST['uri']);
        $graph->load();
        if ($graph->type() == 'foaf:PersonalProfileDocument') {
            $person = $graph->primaryTopic();
        } else if ($graph->type() == 'foaf:Person') {
            $person = $graph->resource();
        }
    }

    if (isset($person)) {
?>

<dl>
  <dt>Name:</dt><dd><?= $person->get('foaf:name') ?></dd>
  <dt>Homepage:</dt><dd><?= link_to( $person->get('foaf:homepage') ) ?></dd>
  <dt>Description:</dt><dd><?= $person->get(array('dc:description','dc11:description')) ?></dd>
</dl>

<?php
        echo "<h2>Known Persons</h2>\n";
        echo "<ul>\n";
        foreach ($person->all('foaf:knows') as $friend) {
            $label = $friend->label();
            if (!$label) {
                $label = $friend->getUri();
            }

            if ($friend->isBnode()) {
                echo "<li>$label</li>";
            } else {
                echo "<li>".link_to_self( $label, 'uri='.urlencode($friend) )."</li>";
            }
        }
        echo "</ul>\n";
    }

    if (isset($graph)) {
        echo "<br />";
        echo $graph->dump();
    }
?>
</body>
</html>
