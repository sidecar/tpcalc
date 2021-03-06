<?php

/*
*/
ini_set('display_errors', 1);
error_reporting(E_ALL);

$today = date("Y-m-d h:i:s");
$travelAttendees = $_REQUEST['travelAttendees'];
$travelAverageEmissions = $_REQUEST['travelAverageEmissions'];
$travelBusAttendees = $_REQUEST['travelBusAttendees'];
$travelBusMileage = $_REQUEST['travelBusMileage'];
$travelCarAttendees = $_REQUEST['travelCarAttendees'];
$travelCarMileage = $_REQUEST['travelCarMileage'];
$travelFerryAttendees = $_REQUEST['travelFerryAttendees'];
$travelFerryMileage = $_REQUEST['travelFerryMileage'];
$travelGroundEmissions = $_REQUEST['travelGroundEmissions'];
$travelHotelEmissions = $_REQUEST['travelHotelEmissions'];
$travelLengthEmissions = $_REQUEST['travelLengthEmissions'];
$travelLongFlights = $_REQUEST['travelLongFlights'];
$travelMedFlights = $_REQUEST['travelMedFlights'];
$travelMethod = $_REQUEST['travelMethod'];
$travelNights = $_REQUEST['travelNights'];
$travelShortFlights = $_REQUEST['travelShortFlights'];
$travelTaxiAttendees = $_REQUEST['travelTaxiAttendees'];
$travelTaxiMileage = $_REQUEST['travelTaxiMileage'];
$travelTrainAttendees = $_REQUEST['travelTrainAttendees'];
$travelTrainMileage = $_REQUEST['travelTrainMileage'];
$travelUseRFI = $_REQUEST['travelUseRFI'];
$travelTotalEmissions = $_REQUEST['travelTotalEmissions'];
$venueDays = $_REQUEST['venueDays'];
$venueVenueSize = $_REQUEST['venueVenueSize'];
$venueZipCode = $_REQUEST['venueZipCode'];
$venueTotalEmissions = $_REQUEST['venueTotalEmissions'];
$waterBottles = $_REQUEST['waterBottles'];
$waterTotalEmissions = $_REQUEST['waterTotalEmissions'];
$mealsNumMeals = $_REQUEST['mealsNumMeals'];
$mealsPercentVeg = $_REQUEST['mealsPercentVeg'];
$mealsTotalEmissions = $_REQUEST['mealsTotalEmissions'];
$trees = $_REQUEST['trees'];
$email = urldecode($_REQUEST['email']);

$values = array(
  $today, 
  $travelAttendees ,
  $travelAverageEmissions,
  $travelBusAttendees,
  $travelBusMileage,
  $travelCarAttendees,
  $travelCarMileage,
  $travelFerryAttendees,
  $travelFerryMileage,
  $travelGroundEmissions,
  $travelHotelEmissions,
  $travelLengthEmissions,
  $travelLongFlights,
  $travelMedFlights,
  $travelMethod,
  $travelNights,
  $travelShortFlights,
  $travelTaxiAttendees,
  $travelTaxiMileage,
  $travelTrainAttendees,
  $travelTrainMileage,
  $travelUseRFI,
  $travelTotalEmissions,
  $venueDays,
  $venueVenueSize,
  $venueZipCode,
  $venueTotalEmissions,
  $waterBottles,
  $waterTotalEmissions,
  $mealsNumMeals,
  $mealsPercentVeg,
  $mealsTotalEmissions,
  $email
);

if($_SERVER['HTTP_HOST'] == 'swirlreview.com') {
	//swirlreview.com
	$file = fopen('/var/www/clients/terrapass/working/data_evt.csv', 'a');
} else {
	//terrapass.com
	$file = fopen(getcwd().'/data_evt.csv', 'a');
}

fwrite($file, "\n");
fputcsv($file, $values);
fclose($file);

exit;

?>