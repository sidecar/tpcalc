<?php

// config
//require_once('model-config.php');

// require_once('../../../../../wp-config.php');
require_once('wp-config.php');

define('DB_PASS',DB_PASSWORD);

define('DB_PREFIX', 'tp_');
define('DB_TABLE', 'car_model');

define('YEAR', $_GET['year']);
define('MAKE', $_GET['make']);

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

function db_fv_quote_($fv){return mysql_real_escape_string($fv,db_me());};
function db_select_model($year,$make){
$qry ="SELECT model.* ";
$qry.=", ROUND(1.0/model.combMpg, 5) as galsPerMile ";
$qry.=", ROUND(ft.lbsCo2PerGal/model.combMpg, 5) as lbsCo2PerMile ";
$qry.="FROM ".db_table()." model ";
$qry.="LEFT JOIN ".db_table('car_fuel_type')." ft ";
$qry.="ON model.fuelType = ft.fuelType ";
$qry.="WHERE year='".db_fv_quote_($year)."' ";
$qry.=" AND  make='".db_fv_quote_($make)."' ";
//printf("q: %s".EOL,$qry);
if(!$res=mysql_query($qry,db_me())) die("!db_select ".mysql_error());
unset($qry);
return $res;
}

// provider

// integer/float properties
$flv=array(
"galsPerMile",
"lbsCo2PerMile",
"milesPerYear",
"percentBiodiesel",
"usdCostPerMile",
);

$rpy=array();

$res=db_select_model(YEAR,MAKE);
if($res)
while($row=mysql_fetch_assoc($res)){

$model=array();
foreach($row as $k=>$v){
$model[$k]=(in_array($k,$flv))? floatval($v): $v;
}
$model["id"]="";
$model["isSimple"]=false;
$model["lastModified"]=0;
$rpy[$row['model']][$row['transmissionType']][$row['fuelType']]=$model;
}

$body=(0<count($rpy))? json_encode($rpy): '{ }';
header("Content-Type: application/json");
header("Content-Length: ".sprintf("%u",strlen($body)));
echo $body;
//echo (0<count($rpy))? json_encode($rpy): '{ }';

?>