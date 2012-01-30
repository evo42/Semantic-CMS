<?php

$url = urldecode($_GET['url']);
if (empty($HTTP_RAW_POST_DATA)) $HTTP_RAW_POST_DATA = false;

$post_data = urldecode(strip_tags($HTTP_RAW_POST_DATA));
$params = array($post_data);
$verb = 'POST';
$format = false;

echo $res = rest_helper($url, $post_data, $verb, $format);

function rest_helper($url, $params = null, $verb = 'GET', $format = 'json') {
	$cparams = array(
		'http' 	=> array(
			'method' 	=> $verb,
			'ignore_errors' => true,
			'header'	=>	"Accept-language: en\r\n" .
							"Accept: application/json\r\n".
							"Content-type: text/plain\r\n"
		)
	);

	if ($verb == 'POST' && !is_array($params)) {
		$cparams['http']['content'] = $params;
	} else if ($params !== null) {
		$params = http_build_query($params);
		if ($verb == 'POST') {
			$cparams['http']['content'] = $params;
		} else {
			$url .= '?' . $params;
		}
	}

	$context = stream_context_create($cparams);
	$fp = fopen($url, 'rb', false, $context);
	if (!$fp) {
		$res = false;
	} else {
		// If you're trying to troubleshoot problems, try uncommenting the
		// next two lines; it will show you the HTTP response headers across
		// all the redirects:
		//$meta = stream_get_meta_data($fp);
		//var_dump($meta['wrapper_data']);
		$res = stream_get_contents($fp);
	}
	
	if ($res === false) {
		throw new Exception("$verb $url failed: $php_errormsg");
	}

	switch ($format) {
		case 'json':

			$encoding = mb_detect_encoding($res, 'UTF-8', true);
			if ($encoding != 'UTF-8') {
				$res = utf8_encode($res);
			}
		
			$r = json_decode($res, true);
			if ($r === null) {
				throw new Exception("failed to decode $res as json");
			}
		return $r;

		case 'xml':
			$r = simplexml_load_string($res);
			if ($r === null) {
				throw new Exception("failed to decode $res as xml");
			}
		return $r;
	}

	return $res;
}
?>