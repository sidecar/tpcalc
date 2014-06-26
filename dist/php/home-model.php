<?php

// config
//require_once('model-config.php');

//require_once('../../../../../wp-config.php');
require_once('wp-config.php');

define('DB_PASS',DB_PASSWORD);

define('DB_PREFIX', 'tp_');
define('DB_TABLE', 'home_');

define('ZIP', $_GET['zip']);

// db

$db_me_;
function db_me($ops=0){
if(!isset($db_me_)){
$db_me_=@mysql_connect(DB_HOST,DB_USER,DB_PASS,false,$ops) or die("!db_conn ".mysql_error());
@mysql_select_db(DB_NAME,$db_me_) or die("!db_sele ".DB_NAME." ".mysql_error());
}
return $db_me_;
}
function db_table($name){return '`'.DB_PREFIX.DB_TABLE.$name.'`';}

function db_fv_quote_($fv){return mysql_real_escape_string($fv,db_me());};

function db_select_zip_data($zip){
// override se.STATE with non-null zs.STATE
$qry = "SELECT zs.*, se.*, zs.STATE ";
$qry.= "FROM ".db_table('zip_state_data')." zs ";
$qry.= "LEFT JOIN ".db_table('zip_eem_data')." ze ";
$qry.= "ON zs.ZIP=ze.ZIP ";
$qry.= "LEFT JOIN ".db_table('state_eem_data')." se ";
$qry.= "ON zs.STATE=se.STATE and ze.EMISSION=se.EMISSION ";
// allow ZIPs without EMISSION data 
$qry.= "WHERE (se.EMISSION is not null or 1) ";
$qry.= "and (zs.ZIP = '".sprintf("%05u",$zip)."') ";
$qry.= "LIMIT 1; ";

//printf("q: %s".EOL,$qry);
if(!$res=mysql_query($qry,db_me())) die("!db_select ".mysql_error());
unset($qry);
return $res;
}

// provider

$rpy=array();

$res=db_select_zip_data(ZIP);
if(!$res){
$rpy['error']=mysql_error();
}else
if($row=mysql_fetch_assoc($res)){

//var_dump($row);

function usdval($amt){
if($amt === null) $amt = "0.00";
$usd = substr($amt,-3); // '.cc'
$amt = substr($amt,0,strlen($amt)-3);
while(3<strlen($amt)){
$usd = ','.substr($amt,-3).$usd;
$amt = substr($amt,0,strlen($amt)-3);
}
$usd = '$'.$amt.$usd;
return $usd;
}

$rpy["location"]["zip"]   = $row['ZIP'];
$rpy["location"]["state"] = $row['STATE'];
$rpy["location"]["city"]  = $row['CITY'];

$rpy["eleGasCombo"]["avgMonthlyBill"] = usdval($row['COMBO_AVG_MONTHLY']);
$rpy["eleGasCombo"]["usdToCo2Lbs"]    = floatval($row['COMBO_USD_TO_CO2_LBS']);
$rpy["electricity"]["avgMonthlyBill"] = usdval($row['ELEC_AVG_MONTHLY']);
$rpy["electricity"]["usdToCo2Lbs"]    = floatval($row['ELEC_USD_TO_CO2_LBS']);
$rpy["gas"        ]["avgMonthlyBill"] = usdval($row['GAS_AVG_MONTHLY']);
$rpy["gas"        ]["usdToCo2Lbs"]    = floatval($row['GAS_USD_TO_CO2_LBS']);

$rpy["heatingOil" ]["avgMonthlyBill"] = usdval($row['OIL_AVG_YEARLY']);
$rpy["heatingOil" ]["usdToCo2Lbs"]    = floatval($row['OIL_USD_TO_CO2_LBS']);
$rpy["propane"    ]["avgMonthlyBill"] = usdval($row['PROP_AVG_YEARLY']);
$rpy["propane"    ]["usdToCo2Lbs"]    = floatval($row['PROP_USD_TO_CO2_LBS']);

}else{
// no data for this ZIP
//$rpy['error']=mysql_error();
}

$body=(0<count($rpy))? json_encode($rpy): '';
header("Content-Type: application/json");
header("Content-Length: ".sprintf("%u",strlen($body)));
echo $body;

?>