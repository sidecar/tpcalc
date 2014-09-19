<?php

/*
*/
ini_set('display_errors', 1);
error_reporting(E_ALL);

$today = date("Y-m-d h:i:s");
$vehicles = $_REQUEST['vehicles'];
$vehicleTotalEmissions = $_REQUEST['vehicleTotalEmissions'];
$transitBusInterval = $_REQUEST['transitBusInterval'];
$transitBusMileage = $_REQUEST['transitBusMileage'];
$transitFerryInterval = $_REQUEST['transitFerryInterval'];
$transitFerryMileage = $_REQUEST['transitFerryMileage'];
$transitTaxiInterval = $_REQUEST['transitTaxiInterval'];
$transitTaxiMileage = $_REQUEST['transitTaxiMileage'];
$transitTrainInterval = $_REQUEST['transitTrainInterval'];
$transitTrainMileage = $_REQUEST['transitTrainMileage'];
$transitTotalEmissions = $_REQUEST['transitTotalEmissions'];
$flights = $_REQUEST['flights'];
$travelEstimationMethod = $_REQUEST['travelEstimationMethod'];
$travelMilesLongBizClassFlights = $_REQUEST['travelMilesLongBizClassFlights'];
$travelMilesLongEconFlights = $_REQUEST['travelMilesLongEconFlights'];
$travelMilesLongEconPlusFlights = $_REQUEST['travelMilesLongEconPlusFlights'];
$travelMilesLongFirstClassFlights = $_REQUEST['travelMilesLongFirstClassFlights'];
$travelMilesMedEconFlights = $_REQUEST['travelMilesMedEconFlights'];
$travelMilesMedFirstClassFlights = $_REQUEST['travelMilesMedFirstClassFlights'];
$travelMilesShortFlights = $_REQUEST['travelMilesShortFlights'];
$travelNumLongBizClassFlights = $_REQUEST['travelNumLongBizClassFlights'];
$travelNumLongEconFlights = $_REQUEST['travelNumLongEconFlights'];
$travelNumLongEconPlusFlights = $_REQUEST['travelNumLongEconPlusFlights'];
$travelNumLongFirstClassFlights = $_REQUEST['travelNumLongFirstClassFlights'];
$travelNumMedEconFlights = $_REQUEST['travelNumMedEconFlights'];
$travelNumMedFirstClassFlights = $_REQUEST['travelNumMedFirstClassFlights'];
$travelNumShortFlights = $_REQUEST['travelNumShortFlights'];
$travelUseRFI = $_REQUEST['travelUseRFI'];
$travelTotalEmissions = $_REQUEST['travelTotalEmissions'];
$homeDieselAmount = $_REQUEST['homeDieselAmount'];
$homeDieselInterval = $_REQUEST['homeDieselInterval'];
$homeDieselUnit = $_REQUEST['homeDieselUnit'];
$homeDisplayName = $_REQUEST['homeDisplayName'];
$homeElectricityAmount = $_REQUEST['homeElectricityAmount'];
$homeElectricityInterval = $_REQUEST['homeElectricityInterval'];
$homeElectricityUnit = $_REQUEST['homeElectricityUnit'];
$homeGasolineAmount = $_REQUEST['homeGasolineAmount'];
$homeGasolineInterval = $_REQUEST['homeGasolineInterval'];
$homeGasolineUnit = $_REQUEST['homeGasolineUnit'];
$homeHeatingOilAmount = $_REQUEST['homeHeatingOilAmount'];
$homeHeatingOilInterval = $_REQUEST['homeHeatingOilInterval'];
$homeHeatingOilUnit = $_REQUEST['homeHeatingOilUnit'];
$homeNaturalGasAmount = $_REQUEST['homeNaturalGasAmount'];
$homeNaturalGasInterval = $_REQUEST['homeNaturalGasInterval'];
$homeNaturalGasUnit = $_REQUEST['homeNaturalGasUnit'];
$homePropaneAmount = $_REQUEST['homePropaneAmount'];
$homePropaneInterval = $_REQUEST['homePropaneInterval'];
$homePropaneUnit = $_REQUEST['homePropaneUnit'];
$homeTotalEmissions = $_REQUEST['homeTotalEmissions'];
$trees = $_REQUEST['trees'];
$email = $_REQUEST['email'];

$values = array(
  $today, 
  $vehicles,
  $vehicleTotalEmissions,
  $transitBusInterval,
  $transitBusMileage,
  $transitFerryInterval,
  $transitFerryMileage,
  $transitTaxiInterval,
  $transitTaxiMileage,
  $transitTrainInterval,
  $transitTrainMileage,
  $transitTotalEmissions,
  $flights,
  $travelEstimationMethod,
  $travelMilesLongBizClassFlights,
  $travelMilesLongEconFlights,
  $travelMilesLongEconPlusFlights,
  $travelMilesLongFirstClassFlights,
  $travelMilesMedEconFlights,
  $travelMilesMedFirstClassFlights,
  $travelMilesShortFlights,
  $travelNumLongBizClassFlights,
  $travelNumLongEconFlights,
  $travelNumLongEconPlusFlights,
  $travelNumLongFirstClassFlights,
  $travelNumMedEconFlights,
  $travelNumMedFirstClassFlights,
  $travelNumShortFlights,
  $travelUseRFI,
  $travelTotalEmissions,
  $homeDieselAmount,
  $homeDieselInterval,
  $homeDieselUnit,
  $homeDisplayName,
  $homeElectricityAmount,
  $homeElectricityInterval,
  $homeElectricityUnit,
  $homeGasolineAmount,
  $homeGasolineInterval,
  $homeGasolineUnit,
  $homeHeatingOilAmount,
  $homeHeatingOilInterval,
  $homeHeatingOilUnit,
  $homeNaturalGasAmount,
  $homeNaturalGasInterval,
  $homeNaturalGasUnit,
  $homePropaneAmount,
  $homePropaneInterval,
  $homePropaneUnit,
  $homeTotalEmissions
);

if($_SERVER['HTTP_HOST'] == 'swirlreview.com') {
	//swirlreview.com
  $file = fopen('/var/www/clients/terrapass/working/data_ind.csv', 'a');
} else {
	//terrapass.com
  $file = fopen(getcwd().'/data_ind.csv', 'a');
	//$file = fopen('data_ind.csv', 'a');
}

// foreach ($values as $line){
//  fseek($file, 1);
//  fputcsv($file,explode(',',$line));
// }

fseek($file, 1);
fputcsv($file, $values);

fclose($file);

// REPLACE HARD CODED VALUES BELOW WITH VARIABLES FROM ABOVE
// header("Location: summary.php?trees=".$trees."&co2e_vehicle=".$vehicleTotalEmissions."&co2e_transit=".$transitTotalEmissions."&co2e_travel=".$travelTotalEmissions."&co2e_home=".$homeTotalEmissions);
// header("Location: http://www.terrapass.com/email/individual_email_send.php?emailAddr=".$email."&trees=".$trees."&co2e_vehicle=".$vehicleTotalEmissions."&co2e_transit=".$transitTotalEmissions."&co2e_travel=".$travelTotalEmissions."&co2e_home=".$homeTotalEmissions);
exit;
?>
