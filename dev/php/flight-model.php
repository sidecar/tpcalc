<?php

// config
//require_once('model-config.php');

//require_once('../../../../../wp-config.php');
require_once('wp-config.php');

define('DB_PASS',DB_PASSWORD);

define('DB_PREFIX', 'tp_');
//define('DB_TABLE', 'flight_model');

// db

$db_me_;
function db_me($ops=0){
if(!isset($db_me_)){
//error_reporting(E_ALL-(E_NOTICE|E_WARNING));
$db_me_=@mysql_connect(DB_HOST,DB_USER,DB_PASS,false,$ops) or die("!db_conn ".mysql_error());
@mysql_select_db(DB_NAME,$db_me_) or die("!db_sele ".DB_NAME." ".mysql_error());
}
return $db_me_;
}
function db_table($name=DB_TABLE){return '`'.DB_PREFIX.$name.'`';}

// provider

// receiving always this via terrapass.com server
// trx.com v8.1 EOL-d?..
$rpy=array(
 "allAirlineAverages" => array(),
 "combinedAverages" => null,
 "miles" => 0
);

$body=(0<count($rpy))? json_encode($rpy): '{ }';
header("Content-Type: application/json");
header("Content-Length: ".sprintf("%u",strlen($body)));
echo $body;

?>