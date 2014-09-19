<?php

/*
*/
ini_set('display_errors', 1);
error_reporting(E_ALL);

$today = date("Y-m-d h:i:s");
$siteZip = $_REQUEST['siteZip'];
$siteDieselAmount = $_REQUEST['siteDieselAmount'];
$siteDieselInterval = $_REQUEST['siteDieselInterval'];
$siteDieselUnit = $_REQUEST['siteDieselUnit'];
$siteDisplayName = $_REQUEST['siteDisplayName'];
$siteElectricityAmount = $_REQUEST['siteElectricityAmount'];
$siteElectricityInterval = $_REQUEST['siteElectricityInterval'];
$siteElectricityUnit = $_REQUEST['siteElectricityUnit'];
$siteGasolineAmount = $_REQUEST['siteGasolineAmount'];
$siteGasolineInterval = $_REQUEST['siteGasolineInterval'];
$siteGasolineUnit = $_REQUEST['siteGasolineUnit'];
$siteHeatingOilAmount = $_REQUEST['siteHeatingOilAmount'];
$siteHeatingOilInterval = $_REQUEST['siteHeatingOilInterval'];
$siteHeatingOilUnit = $_REQUEST['siteHeatingOilUnit'];
$siteNaturalGasAmount = $_REQUEST['siteNaturalGasAmount'];
$siteNaturalGasInterval = $_REQUEST['siteNaturalGasInterval'];
$siteNaturalGasUnit = $_REQUEST['siteNaturalGasUnit'];
$sitePropaneAmount = $_REQUEST['sitePropaneAmount'];
$sitePropaneInterval = $_REQUEST['sitePropaneInterval'];
$sitePropaneUnit = $_REQUEST['sitePropaneUnit'];
$siteTotalEmissions = $_REQUEST['siteTotalEmissions'];
$fleetVehicles = $_REQUEST['fleetVehicles'];
$fleetTotalEmissions = $_REQUEST['fleetTotalEmissions'];
$travelLongHaulPerEmp = $_REQUEST['travelLongHaulPerEmp'];
$travelMedHaulPerEmp = $_REQUEST['travelMedHaulPerEmp'];
$travelMethod = $_REQUEST['travelMethod'];
$travelNumEmployeesTraveling = $_REQUEST['travelNumEmployeesTraveling'];
$travelPercentLongHaulMiles = $_REQUEST['travelPercentLongHaulMiles'];
$travelPercentMedHaulMiles = $_REQUEST['travelPercentMedHaulMiles'];
$travelPercentShortHaulMiles = $_REQUEST['travelPercentShortHaulMiles'];
$travelShortHaulPerEmp = $_REQUEST['travelShortHaulPerEmp'];
$travelTotalAnnMiles = $_REQUEST['travelTotalAnnMiles'];
$travelUseRFI = $_REQUEST['travelUseRFI'];
$travelTotalEmissions = $_REQUEST['travelTotalEmissions'];
$commuteBusEmployees = $_REQUEST['commuteBusEmployees'];
$commuteBusMileage = $_REQUEST['commuteBusMileage'];
$commuteCarEmployees = $_REQUEST['commuteCarEmployees'];
$commuteCarMileage = $_REQUEST['commuteCarMileage'];
$commuteFerryEmployees = $_REQUEST['commuteFerryEmployees'];
$commuteFerryMileage = $_REQUEST['commuteFerryMileage'];
$commuteTaxiEmployees = $_REQUEST['commuteTaxiEmployees'];
$commuteTaxiMileage = $_REQUEST['commuteTaxiMileage'];
$commuteTrainEmployees = $_REQUEST['commuteTrainEmployees'];
$commuteTrainMileage = $_REQUEST['commuteTrainMileage'];
$commuteTotalEmissions = $_REQUEST['commuteTotalEmissions'];
$shippingTrainDistance = $_REQUEST['shippingTrainDistance'];
$shippingTrainShipments = $_REQUEST['shippingTrainShipments'];
$shippingTrainWeight = $_REQUEST['shippingTrainWeight'];
$shippingTruckDistance = $_REQUEST['shippingTruckDistance'];
$shippingTruckShipments = $_REQUEST['shippingTruckShipments'];
$shippingTruckWeight = $_REQUEST['shippingTruckWeight'];
$shippingTotalEmissions = $_REQUEST['shippingTotalEmissions'];
$serverNumServers = $_REQUEST['serverNumServers'];
$serverZip = $_REQUEST['serverZip'];
$serverTotalEmissions = $_REQUEST['serverTotalEmissions'];
$trees = $_REQUEST['trees'];
$email = urldecode($_REQUEST['email']);

$values = array(
  $today,  
  $siteZip, 
  $siteDieselAmount, 
  $siteDieselInterval, 
  $siteDieselUnit, 
  $siteDisplayName, 
  $siteElectricityAmount, 
  $siteElectricityInterval, 
  $siteElectricityUnit, 
  $siteGasolineAmount, 
  $siteGasolineInterval, 
  $siteGasolineUnit, 
  $siteHeatingOilAmount, 
  $siteHeatingOilInterval, 
  $siteHeatingOilUnit, 
  $siteNaturalGasAmount, 
  $siteNaturalGasInterval, 
  $siteNaturalGasUnit, 
  $sitePropaneAmount, 
  $sitePropaneInterval, 
  $sitePropaneUnit, 
  $siteTotalEmissions, 
  $fleetVehicles, 
  $fleetTotalEmissions, 
  $travelLongHaulPerEmp, 
  $travelMedHaulPerEmp, 
  $travelMethod, 
  $travelNumEmployeesTraveling, 
  $travelPercentLongHaulMiles, 
  $travelPercentMedHaulMiles, 
  $travelPercentShortHaulMiles, 
  $travelShortHaulPerEmp, 
  $travelTotalAnnMiles, 
  $travelUseRFI, 
  $travelTotalEmissions, 
  $commuteBusEmployees, 
  $commuteBusMileage, 
  $commuteCarEmployees, 
  $commuteCarMileage, 
  $commuteFerryEmployees, 
  $commuteFerryMileage, 
  $commuteTaxiEmployees, 
  $commuteTaxiMileage, 
  $commuteTrainEmployees, 
  $commuteTrainMileage, 
  $commuteTotalEmissions, 
  $shippingTrainDistance, 
  $shippingTrainShipments, 
  $shippingTrainWeight, 
  $shippingTruckDistance, 
  $shippingTruckShipments, 
  $shippingTruckWeight, 
  $shippingTotalEmissions, 
  $serverNumServers, 
  $serverZip, 
  $serverTotalEmissions,
  $email
);

if($_SERVER['HTTP_HOST'] == 'swirlreview.com') {
  //swirlreview.com
  $file = fopen('/var/www/clients/terrapass/working/data_bus.csv', 'a');
} else {
  //terrapass.com
  $file = fopen(getcwd().'/data_bus.csv', 'a');
}

// foreach ($values as $line){
//  fseek($file, 1);
//  fputcsv($file,explode(',',$line));
// }

fwrite($file, "\n");
fputcsv($file, $values);
fclose($file);

// REPLACE HARD CODED VALUES BELOW WITH VARIABLES FROM ABOVE
// header("Location: summary.php?trees=".$trees."&co2e_vehicle=".$siteTotalEmissions."&co2e_transit=".$fleetTotalEmissions."&co2e_travel=".$travelTotalEmissions."&co2e_home=".$commuteTotalEmissions."&co2e_home=".$shippingTotalEmissions."&co2e_home=".$serverTotalEmissions);
// header("Location: http://www.terrapass.com/email/business_email_send.php?emailAddr=".$email."&trees=".$trees."&co2e_vehicle=".$siteTotalEmissions."&co2e_transit=".$fleetTotalEmissions."&co2e_travel=".$travelTotalEmissions."&co2e_home=".$commuteTotalEmissions."&co2e_home=".$shippingTotalEmissions."&co2e_home=".$serverTotalEmissions);
exit;
?>