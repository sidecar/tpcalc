<?php
/**
 * Ajax responder that accepts a 'key' query parameter.
 *
 * If a non-empty 'strict' parameter is also given, then
 * this responder will send back only the one airport
 * whose code exactly matches the key parameter value.
 */

/////////////
// Globals //
/////////////

$AIRPORT_DB_FILE = "airports-sorted.db";
$DB_RECORD_REGEX =
    /* Display Name, entry type */
    '/^.:([^|]*)\|(.)\|\s*' .
    /* Airport Code[1], Airport Name[2], City[3], State[4], Country[5] */
    '"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"' .
    /* WAC, begin date, end date, region */
    ',[^,]*,[^,]*,[^,]*,"[^"]*"' .
    /* Latitude: degrees[6], minutes[7], seconds[8], N/S[9], latitude[10] */
    ',([^,]*),([^,]*),([^,]*),"([^"]*)",([^,]*)' .
    /* Longitude: degrees[11], minutes[12], seconds[13], E/W[14], longitude[15] */
    ',([^,]*),([^,]*),([^,]*),"([^"]*)",([^,]*)' .
    '/i';


//////////
// Main //
//////////

header('Content-Type: text/xml');

echo "<xml>\n<airports>\n";

if(isset($_REQUEST['key'])){
	$key = strip_tags(substr(trim($_REQUEST['key']),0,500));
} else {
	$key = '';
}
if(isset($_REQUEST['strict'])){
	$strict = (boolean) $_REQUEST['strict'];
} else {
	$strict = false;
}

if($key) {
	$fd = fopen($AIRPORT_DB_FILE, "r");
	while(!feof($fd)) {
		$rec = fgets($fd, 4096);
		if(preg_match('#^.:' . $key . '#i', $rec)) {
			$airport = parse_airport($rec);
			if($airport) {
				if(!$strict || $airport['code'] == $key) {
					print_airport($airport);
					if($strict) {
						break;
					}
				}
			}
		}
	}
	fclose($fd);
}

echo "</airports>\n</xml>\n";

///////////////
// Functions //
///////////////

function parse_airport($rec) {
	global $DB_RECORD_REGEX;

	if(!preg_match($DB_RECORD_REGEX, $rec, $fields)) {
		return false;
	}

	$arr = array(
		'display' => $fields[1],
		'canon'   => $fields[5],
		'lat'     => $fields[12],
		'hemi'    => $fields[11],
		'long'    => $fields[17],
		'lhemi'   => $fields[16],
		'type'    => $fields[2],
		'code'    => $fields[3]
	);

	return $arr;
}

function print_airport($arr) {

	echo "<airport";
	foreach($arr as $name => $value) {
		echo " {$name}=\"{$value}\"";
	}
	echo "/>\n";
}

?>