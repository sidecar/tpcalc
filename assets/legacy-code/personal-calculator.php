<!DOCTYPE html>

<!--[if IE 6]>

<html id="ie6" dir="ltr" lang="en-US">

<![endif]-->

<!--[if IE 7]>

<html id="ie7" dir="ltr" lang="en-US">

<![endif]-->

<!--[if IE 8]>

<html id="ie8" dir="ltr" lang="en-US">

<![endif]-->

<!--[if !(IE 6) | !(IE 7) | !(IE 8) ]>
<!-->

<html dir="ltr" lang="en-US">
  
  <!--
<![endif]-->
  
  <head>
    
    <meta name="google-site-verification" content="v9DHqx2zSOnBDXjFoulP1FKn-MpRgUYOEL0Pe5XLm28" />
    
    <meta charset="UTF-8" />
    
    <meta name="viewport" content="width=device-width" />
    
    <title>
      Carbon Footprint Calculator | TerraPass
    </title>
    
    <link rel="profile" href="http:/gmpg.org/xfn/11" />
    
    <!-- Personal Calc: header contents -->
    
    <link rel="stylesheet" href="wp-content/themes/terrapass/terrapass.css?1" type="text/css" media="all">
    
    <link rel="stylesheet" href="wp-content/themes/terrapass/unified_calc.css" type="text/css" media="all">
    
    <link rel="stylesheet" href="wp-content/themes/terrapass/carbon-calc-popup.css" type="text/css" media="all">
    
    <link rel="stylesheet" href="wp-content/themes/terrapass/carbon-calc-take-action.css?" type="text/css" media="all">
    
    <link rel="stylesheet" type="text/css" href="jquery-ui/css/terrapass-green/jquery-ui-1.8.21.custom.css"/>
    
    <script type="text/javascript" src="jquery-ui/js/jquery-1.7.2.min.js">
    </script>
    
    <script type="text/javascript" src="jquery-ui/js/jquery-ui-1.8.21.custom.min.js">
    </script>
    
    <script type="text/javascript" src="wp-content/themes/terrapass/js/json.js">
    </script>
    
    <script type="text/javascript" src="wp-content/themes/terrapass/js/cookie.js">
    </script>
    
    <script type="text/javascript" src="wp-content/themes/terrapass/js/cookieutils.js">
    </script>
    
    <script type="text/javascript" src="wp-content/themes/terrapass/js/unified_calc.js">
    </script>
    
    <script type="text/javascript" src="wp-content/themes/terrapass/js/year_make.js">
    </script>
    
    <script type="text/javascript">
      $(document).ready(function(){
        TPCalc.init();
      }
                       );
      $(function() {
        $("#airtravelnext").button({
          icons: {
            secondary: "ui-icon-circle-triangle-e" }
        }
                                  );
        $("#homeenergynext").button({
          icons: {
            secondary: "ui-icon-circle-triangle-e" }
        }
                                   );
        $("#seeyourresults").button({
          icons: {
            secondary: "ui-icon-circle-triangle-e" }
        }
                                   );
        $("#nextstep").button({
          icons: {
            secondary: "ui-icon-circle-triangle-e" }
        }
                             );
        $("#sharefacebook").button();
      }
       );
      
    </script>
    
    <style>
      .fancybox-custom .fancybox-skin {
        box-shadow: 0 0 50px #222;
      }
      body {
        margin:0;
        padding:0;
        font-family:Arial, Helvetica, sans-serif;
      }
      #centercolumn {
        margin: 0;
        padding:0;
        text-align: left;
        width: 100%;
      }
      #calculator_header {
        margin: 0;
        padding: 0;
        position: relative;
      }
      #calculator_navigation {
        margin-top:5px;
      }
      input[type="text"] {
        padding: 3px;
      }
      input[type="text"], input[type="password"], textarea {
        background: none repeat scroll 0 0 #FAFAFA;
        border: 1px solid #DDDDDD;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) inset;
        color: #888888;
      }
      #calculator_cluster .data-controls {
        width: 385px;
      }
      #trx_attribution p {
        width:400px;
        float:right;
      }
      
    </style>
    
    <style>
      #trx_attribution {
        display: none;
      }
    </style>
    
  </head>
  
  <div id="centercolumn">
    
    <script language="javascript">
      //try{ checkCookiesEnabled(); }catch(e){ } 
    </script>
    
    <div style="visibility:hidden; display:none;">
      <img src="http:/switch.atdmt.com/action/DRV_TerraPass_ForHomeEnergyPage" height="1" width="1">
    </div>
    
    <div id="calcform">
      
      <!-- ********** START CALCULATOR CODE ********** -->
      
      <div id="calculator_header">
        
        <H1>
          Carbon Footprint Calculator 
        </H1>
        
      </div>
      <!-- End #calculator_header -->
      
      <div id="calculator_navigation">
        
        <div class="total">
          
          <p>
            <a href="#action" class="expand">
              <img src="wp-content/themes/terrapass/images/calc_see_your_results.png" alt="See your results and buy offsets &raquo;">
            </a>
          </p>
          
        </div>
        <!-- End .total -->
        
        <ul>
          
          <li id="road_tab">
            <a href="#road" class="expand text-replace">
              Calculate driving &raquo;
            </a>
          </li>
          
          <li id="air_tab">
            <a href="#air" class="expand text-replace">
              Calculate air travel &raquo;
            </a>
          </li>
          
          <li id="residential_tab">
            <a href="#residential" class="expand text-replace">
              Calculate home &raquo;
            </a>
          </li>
          
        </ul>
        
        <div class="clear">
        </div>
        
      </div>
      <!-- End #calculator_navigation -->
      
      <div id="calculator_cluster" class="loading">
        
        <!-- * * Road Calculator * -->
        
        <div id="road_calculator" class="calculator-tab expanded">
          
          <div class="header">
            
            <h2 >
              Driving 
              <span style="float: right; margin-top: -5px;font-size: 10px; font-weight: normal; color: black; text-align: right;">
                
                <a href="http://www.terrapass.com/wp-content/themes/terrapass/methodology-popup.html" target="_blank">
                  Calculator methodology &raquo;
                </a>
                
                <!--
<a href="http://www.terrapass.com/wp-content/themes/terrapass/methodology-popup.html" class="methodology" >
test
</a>
-->
  
  </span>
  
  </h2>
  
  </div>
  
  <div class="body complex">
    
    <div id="road_controls" class="data-controls">
      
      <div id="complex_road_controls">
        
        <form action="?">
          
          <p>
            Can't find your car or use an alternative fuel? Know your actual MPG?
            <br/>
            
            <a href="#" id="switch_to_simple">
              Click here to calculate&hellip;
            </a>
          </p>
          
          <p class="data-pair">
            
            <span class="data-field">
              <label for="vehicle_year">
                Year:
              </label>
            </span>
            
            <span class="data-value">
              <select id="vehicle_year" name="vehicle_year">
                
                <option value="">
                  Select year&hellip;
                </option>
                
              </select>
            </span>
            
          </p>
          
          <p class="data-pair">
            
            <span class="data-field">
              <label for="vehicle_make">
                Make:
              </label>
            </span>
            
            <span class="data-value">
              <select id="vehicle_make" name="vehicle_make" disabled>
                
                <option value="">
                  Select make&hellip;
                </option>
                
              </select>
            </span>
            
          </p>
          
          <fieldset id="vehicle_model_fieldset" class="off">
            
            <p class="data-pair">
              
              <span class="data-field">
                <label for="vehicle_model">
                  Model:
                </label>
              </span>
              
              <span class="data-value">
                <select id="vehicle_model" name="vehicle_model" disabled>
                  
                  <option value="">
                    Select model&hellip;
                  </option>
                  
                </select>
              </span>
              
            </p>
            
            <div id="vehicle_model_profile" class="collapsed">
              
              <div class="rounded-top">
                
                <div class="rounded-bottom">
                  
                  <div class="rounded-innermost">
                    
                    <div class="data-pair">
                      
                      <p class="data-field">
                        Transmission:
                      </p>
                      
                      <ul>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_transmission_auto" name="vehicle_transmission" value="Automatic" checked disabled>
                          
                          <label for="vehicle_transmission_auto">
                            Automatic
                          </label>
                        </li>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_transmission_std" name="vehicle_transmission" value="Manual" disabled>
                          
                          <label for="vehicle_transmission_std">
                            Manual
                          </label>
                        </li>
                        
                      </ul>
                      
                    </div>
                    
                    <div class="data-pair">
                      
                      <p class="data-field">
                        Fuel:
                      </p>
                      
                      <ul>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_fuel_gas" name="vehicle_fuel" value="Gas" checked disabled>
                          
                          <label for="vehicle_fuel_gas">
                            Gasoline
                          </label>
                        </li>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_fuel_diesel" name="vehicle_fuel" value="Diesel" disabled>
                          
                          <label for="vehicle_fuel_diesel">
                            Diesel
                          </label>
                        </li>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_fuel_ethanol" name="vehicle_fuel" value="Ethanol" disabled>
                          
                          <label for="vehicle_fuel_ethanol">
                            E85
                          </label>
                        </li>
                        
                        <li class="data-value">
                          <input type="radio" id="vehicle_fuel_cng" name="vehicle_fuel" value="CNG" disabled>
                          
                          <label for="vehicle_fuel_cng">
                            CNG
                          </label>
                        </li>
                        
                      </ul>
                      
                    </div>
                    
                    <p class="data-pair collapsed" id="vehicle_biodiesel_controls">
                      
                      <span class="data-field">
                        Do you use biodiesel?
                      </span>
                      
                      <span class="data-value">
                        
                        <input type="radio" id="vehicle_use_biodiesel_no" name="vehicle_use_biodiesel" value="0">
                        
                        <label for="vehicle_use_biodiesel_no">
                          No
                        </label>
                        
                        <input type="radio" id="vehicle_use_biodiesel_yes" name="vehicle_use_biodiesel" value="1">
                        
                        <label for="vehicle_use_biodiesel_yes">
                          Yes
                        </label>
                        
                        <select id="vehicle_biodiesel_percent" name="vehicle_biodiesel_percent">
                          
                          <option value="0%">
                            None
                          </option>
                          
                          <option value="2%">
                            B2 (2%)
                          </option>
                          
                          <option value="5%">
                            B5 (5%)
                          </option>
                          
                          <option value="20%">
                            B20 (20%)
                          </option>
                          
                          <option value="50%">
                            B50 (50%)
                          </option>
                          
                          <option value="80%">
                            B80 (80%)
                          </option>
                          
                          <option value="99%">
                            B99 (99%)
                          </option>
                          
                          <option value="100%">
                            B100 (100%)
                          </option>
                          
                        </select>
                        
                      </span>
                      
                    </p>
                    
                  </div>
                </div>
              </div>
              <!-- End .rounded-innermost, .rounded-bottom, .rounded-top -->
              
            </div>
            <!-- End #vehicle_model_profile -->
            
          </fieldset>
          
          <p class="data-pair">
            
            <span class="data-field">
              <label for="vehicle_miles">
                Miles per year:
              </label>
            </span>
            
            <span class="data-value">
              <select id="vehicle_miles" name="vehicle_miles" disabled>
                
                <option value="">
                  Select miles per year&hellip;
                </option>
                
                <option value="2000">
                  2,000
                </option>
                
                <option value="4000">
                  4,000
                </option>
                
                <option value="6000">
                  6,000
                </option>
                
                <option value="8000">
                  8,000
                </option>
                
                <option value="10000">
                  10,000
                </option>
                
                <option value="12000" selected>
                  12,000
                </option>
                
                <option value="15000">
                  15,000
                </option>
                
                <option value="20000">
                  20,000
                </option>
                
                <option value="25000">
                  25,000
                </option>
                
                <option value="30000">
                  30,000
                </option>
                
                <option value="35000">
                  35,000
                </option>
                
                <option value="40000">
                  40,000
                </option>
                
                <option value="50000">
                  50,000
                </option>
                
                <option value="60000">
                  60,000
                </option>
                
                <option value="70000">
                  70,000
                </option>
                
                <option value="80000">
                  80,000
                </option>
                
                <option value="90000">
                  90,000
                </option>
                
                <option value="100000">
                  100,000
                </option>
                
              </select>
            </span>
            
          </p>
          
          <!--
<p class="data-pair newsletter-signup">
Enter your email address for weekly tips to reduce your carbon footprint: 
<br/>
<span class="data-value" style="">
<input type="text" id="vehicle_email" name="vehicle_email">
</span>
<br class="clearall">
</p>
-->
          
          <p class="data-submit">
            
            <input type="button" id="vehicle_calculate" name="vehicle_calculate" value="Calculate" class="calculate disabled" disabled>
            
          </p>
          
        </form>
        
      </div>
      <!-- End #complex_road_controls -->
      
      <div id="simple_road_controls" class="hidden">
        
        <form action="?">
          
          <p>
            Enter 
            <abbr title="miles per gallon">
              mpg/mpge
            </abbr>
            or 
            <a href="#" id="switch_to_complex">
              select make and model&hellip;
            </a>
            
          </p>
          
          <p class="data-pair">
            
            <span class="data-field">
              <label for="simple_mpg">
                Average miles per gallon:
              </label>
            </span>
            
            <span class="data-value">
              
              <input type="text" id="simple_mpg" name="simple_mpg" value="" size="4" maxlength="3">
              
            </span>
            
          </p>
          
          <p class="data-pair">
            
            <span class="data-field">
              <label for="simple_miles">
                Miles per year:
              </label>
            </span>
            
            <span class="data-value">
              <select id="simple_miles" name="simple_miles">
                
                <option value="">
                  Select miles per year&hellip;
                </option>
                
                <option value="2000">
                  2,000
                </option>
                
                <option value="4000">
                  4,000
                </option>
                
                <option value="6000">
                  6,000
                </option>
                
                <option value="8000">
                  8,000
                </option>
                
                <option value="10000">
                  10,000
                </option>
                
                <option value="12000" selected>
                  12,000
                </option>
                
                <option value="15000">
                  15,000
                </option>
                
                <option value="20000">
                  20,000
                </option>
                
                <option value="25000">
                  25,000
                </option>
                
                <option value="30000">
                  30,000
                </option>
                
                <option value="35000">
                  35,000
                </option>
                
                <option value="40000">
                  40,000
                </option>
                
                <option value="50000">
                  50,000
                </option>
                
                <option value="60000">
                  60,000
                </option>
                
                <option value="70000">
                  70,000
                </option>
                
                <option value="80000">
                  80,000
                </option>
                
                <option value="90000">
                  90,000
                </option>
                
                <option value="100000">
                  100,000
                </option>
                
              </select>
            </span>
            
          </p>
          
          <p class="data-pair">
            
            <span class="data-field">
              Fuel:
            </span>
            
            <span class="data-value">
              
              <input type="radio" id="simple_fuel_gas" name="simple_fuel" value="Gas">
              
              <label for="simple_fuel_gas">
                Gasoline
              </label>
              
              <input type="radio" id="simple_fuel_electric" name="simple_fuel" value="Electric">
              
              <label for="simple_fuel_electric">
                All-electric
              </label>
              
              <input type="radio" id="simple_fuel_diesel" name="simple_fuel" value="Diesel">
              
              <label for="simple_fuel_diesel">
                Diesel
              </label>
              
              <input type="radio" id="simple_fuel_biodiesel" name="simple_fuel" value="Biodiesel">
              
              <label for="simple_fuel_diesel">
                BioDiesel (B20)
              </label>
              
              <br>
              <span style="margin-right:43px">
                &nbsp;
              </span>
              
              <input type="radio" id="simple_fuel_ethanol" name="simple_fuel" value="Ethanol">
              
              <label for="simple_fuel_ethanol">
                Ethanol (E85)
              </label>
              
              <input type="radio" id="simple_fuel_cng" name="simple_fuel" value="CNG">
              
              <label for="simple_fuel_cng">
                Compressed Natural Gas (CNG)
              </label>
              
            </span>
            
          </p>
          
          <p class="data-submit">
            
            <input type="button" id="simple_calculate" name="simple_calculate" value="Calculate" class="calculate disabled">
            
          </p>
          
        </form>
        
      </div>
      <!-- End #simple_road_controls -->
      
    </div>
    <!-- End #road_controls -->
    
    <div id="road_summary" class="data-summary">
      
      <ul>
        
        <li class="active only-child">
          
          <div class="container">
            
            <h3 class="vehicle-id">
              Vehicle 1
            </h3>
            
            <p class="vehicle-mpg-scale hidden">
              
              <span class="vehicle-mpg-city left hidden">
                0 city
              </span>
              
              <span class="vehicle-mpg-hwy right hidden">
                0 hwy
              </span>
              
            </p>
            
            <p class="vehicle-description">
            </p>
            
            <p class="vehicle-consumption hidden">
              
              <span class="vehicle-miles">
                0
              </span>
              miles (
              <span class="vehicle-gallons">
                0
              </span>
              gallons) per year
            </p>
            
          </div>
          <!-- End .container -->
          
          <!-- 
<p class="vehicle-detail">
<a href="#" class="hidden detail button">
<span class="rounded-left">
<span class="rounded-right">
<span class="rounded-edge">
Details
</span>
</span>
</span>
</a>
</p>
-->
          
          <p class="vehicle-bottom-line bottom-line hidden">
            <span class="vehicle-carbon-total">
              0
            </span>
            lbs CO
            <sub>
              2
            </sub>
            per year
          </p>
          
          <p class="vehicle-controls">
            
            <input type="button" id="edit_vehicle" value="Edit" class="edit hidden">
            
            <input type="button" id="delete_vehicle" value="Delete" class="delete hidden button text-replace">
            
          </p>
          
        </li>
        
      </ul>
      
      <p class="add">
        <a href="#" id="add_vehicle" class="button disabled">
          <span class="rounded-left">
            <span class="rounded-right">
              <span class="rounded-edge">
                Add another vehicle
              </span>
            </span>
          </span>
        </a>
      </p>
      
      <!--
<p class="next">
<a href="#air" class="button expand text-replace">
Next: Air travel
</a>
</p>
-->
      
      <p class="skip-to-results hidden">
      </p>
      
      <div class="selector" style="text-align:right">
        
        <a href="#air" id="airtravelnext" class="expand">
          Calculate your air travel next
        </a>
        
      </div>
      
    </div>
    <!-- End #road_summary -->
    
    <div class="clear">
    </div>
    
  </div>
  <!-- End .body -->
  
  </div>
  <!-- End #road_calculator -->
  
  <!-- * * Air Calculator * -->
  
  <div id="air_calculator" class="calculator-tab collapsed">
    
    <div class="header">
      
      <h2>
        Air travel 
        <span style="float: right; margin-top: -5px;font-size: 10px; font-weight: normal; color: black; text-align: right;">
          
          <a href="http://www.terrapass.com/wp-content/themes/terrapass/methodology-popup.html" target="_blank">
            Calculator methodology &raquo;
          </a>
          
        </span>
        
      </h2>
      
    </div>
    
    <div class="body">
      
      <div id="air_controls" class="data-controls">
        
        <form action="?">
          
          <p class="data-pair">
            
            <span class="data-field">
              How would you like to calculate your flight emissions?
            </span>
            <br>
            
            <span class="data-value">
              
              <input type="radio" id="flight_use_simple_no" name="flight_use_simple" value="0">
              
              <label for="flight_use_simple_no">
                Enter individual flights (more accurate)
              </label>
              
            </span>
            <br>
            
            <span class="data-value">
              
              <input type="radio" id="flight_use_simple_yes" name="flight_use_simple" value="1">
              
              <label for="flight_use_simple_yes">
                Enter total number of flights (faster)
              </label>
              
            </span>
            
          </p>
          
          <div id="complex_air_controls" class="collapsed">
            
            <p class="data-pair">
              <span class="data-field">
                Enter airport codes or cities.
              </span>
            </p>
            
            <p class="data-pair flight-multiplier flight-basic-control">
              
              <span class="data-field">
                &nbsp;
              </span>
              
              <span class="data-value">
                <select name="flight_num_ways" id="flight_num_ways">
                  
                  <option value="2">
                    Round trip
                  </option>
                  
                  <option value="1">
                    One way
                  </option>
                  
                </select>
                x 
                <select name="flight_num_times" id="flight_num_times">
                  
                  <option value="1">
                    1
                  </option>
                  
                  <option value="2">
                    2
                  </option>
                  
                  <option value="3">
                    3
                  </option>
                  
                  <option value="4">
                    4
                  </option>
                  
                  <option value="5">
                    5
                  </option>
                  
                  <option value="6">
                    6
                  </option>
                  
                  <option value="7">
                    7
                  </option>
                  
                  <option value="8">
                    8
                  </option>
                  
                  <option value="9">
                    9
                  </option>
                  
                  <option value="10">
                    10
                  </option>
                  
                </select>
                person
              </span>
              
            </p>
            
            <p class="data-pair airport flight-basic-control">
              
              <span class="data-field">
                From:
              </span>
              
              <span class="data-value">
                
                <input type="text" id="flight_dept_airport" name="flight_dept_airport" value="Enter city or airport" class="flight-airport default" size="30" maxlength="100">
              </span>
              
            </p>
            
            <p class="data-pair airport flight-basic-control">
              
              <span class="data-field">
                To:
              </span>
              
              <span class="data-value">
                
                <input type="text" id="flight_dest_airport" name="flight_dest_airport" value="Enter city or airport" class="flight-airport default" size="30" maxlength="100">
              </span>
              
            </p>
            
            <fieldset class="off">
              
              <legend>
                Optional
              </legend>
              
              <div id="flight_specifics">
                
                <p class="data-pair collapsed" id="flight_is_direct_field">
                  
                  <span class="data-field">
                    Is this a non-stop flight?
                  </span>
                  
                  <span class="data-value">
                    
                    <input type="radio" id="flight_is_direct_yes" name="flight_is_direct" value="1">
                    
                    <label for="flight_is_direct_yes">
                      Yes
                    </label>
                    <br>
                    
                    <input type="radio" id="flight_is_direct_no" name="flight_is_direct" value="0">
                    
                    <label for="flight_is_direct_no">
                      No
                    </label>
                    <span id="flight_num_stops_field">
                      , flight makes 
                      <select name="flight_num_stops" id="flight_num_stops">
                        
                        <option value="1">
                          1
                        </option>
                        
                        <option value="2">
                          2
                        </option>
                        
                        <option value="3">
                          3
                        </option>
                        
                        <option value="4">
                          4
                        </option>
                        
                        <option value="5">
                          5
                        </option>
                        
                      </select>
                      stop(s) 
                    </span>
                    
                  </span>
                  
                </p>
                
                <p class="data-pair collapsed" id="flight_airline_field">
                  
                  <span class="data-field">
                    Airline:
                  </span>
                  
                  <span class="data-value">
                    
                    <select name="flight_airline" id="flight_airline">
                      
                      <option value="">
                        Select airline&hellip;
                      </option>
                      
                    </select>
                  </span>
                  
                </p>
                
                <p class="data-pair collapsed" id="flight_class_field">
                  
                  <span class="data-field">
                    Class:
                  </span>
                  
                  <span class="data-value">
                    
                    <select name="flight_class" id="flight_class">
                      
                      <option value="">
                        Select class&hellip;
                      </option>
                      
                    </select>
                  </span>
                  
                </p>
                
              </div>
              <!-- End #flight_specifics -->
              
            </fieldset>
            
            <p class="data-submit">
              
              <input type="button" id="flight_calculate" name="flight_calculate" value="Calculate" class="calculate disabled" disabled>
              
            </p>
            
          </div>
          <!-- End #complex_air_controls -->
          
          <div id="simple_air_controls" class="collapsed">
            
            <p class="data-field">
              Estimate how many round-trip flights you take per year.
            </p>
            
            <p class="data-pair">
              
              <span class="data-field">
                Short flights
              </span>
              
              <span class="data-value">
                <select name="flight_num_short" id="flight_num_short">
                  
                  <option value="0">
                    0
                  </option>
                  
                  <option value="1">
                    1
                  </option>
                  
                  <option value="2">
                    2
                  </option>
                  
                  <option value="3">
                    3
                  </option>
                  
                  <option value="4">
                    4
                  </option>
                  
                  <option value="5">
                    5
                  </option>
                  
                  <option value="6">
                    6
                  </option>
                  
                  <option value="7">
                    7
                  </option>
                  
                  <option value="8">
                    8
                  </option>
                  
                  <option value="9">
                    9
                  </option>
                  
                  <option value="10">
                    10
                  </option>
                  
                  <option value="11">
                    11
                  </option>
                  
                  <option value="12">
                    12
                  </option>
                  
                  <option value="13">
                    13
                  </option>
                  
                  <option value="14">
                    14
                  </option>
                  
                  <option value="15">
                    15
                  </option>
                  
                  <option value="16">
                    16
                  </option>
                  
                  <option value="17">
                    17
                  </option>
                  
                  <option value="18">
                    18
                  </option>
                  
                  <option value="19">
                    19
                  </option>
                  
                  <option value="20">
                    20
                  </option>
                  
                  <option value="25">
                    25
                  </option>
                  
                  <option value="30">
                    30
                  </option>
                  
                  <option value="35">
                    35
                  </option>
                  
                  <option value="40">
                    40
                  </option>
                  
                  <option value="45">
                    45
                  </option>
                  
                  <option value="50">
                    50
                  </option>
                  
                  <option value="55">
                    55
                  </option>
                  
                  <option value="60">
                    60
                  </option>
                  
                  <option value="65">
                    65
                  </option>
                  
                  <option value="70">
                    70
                  </option>
                  
                  <option value="75">
                    75
                  </option>
                  
                  <option value="80">
                    80
                  </option>
                  
                  <option value="85">
                    85
                  </option>
                  
                  <option value="90">
                    90
                  </option>
                  
                  <option value="95">
                    95
                  </option>
                  
                  <option value="100">
                    100
                  </option>
                  
                </select>
              </span>
              
            </p>
            
            <p class="data-note">
              Less than two hours each way.
              <br>
              For example, Boston to Washington, DC.
            </p>
            
            <p class="data-pair">
              
              <span class="data-field">
                Medium flights
              </span>
              
              <span class="data-value">
                <select name="flight_num_medium" id="flight_num_medium">
                  
                  <option value="0">
                    0
                  </option>
                  
                  <option value="1">
                    1
                  </option>
                  
                  <option value="2">
                    2
                  </option>
                  
                  <option value="3">
                    3
                  </option>
                  
                  <option value="4">
                    4
                  </option>
                  
                  <option value="5">
                    5
                  </option>
                  
                  <option value="6">
                    6
                  </option>
                  
                  <option value="7">
                    7
                  </option>
                  
                  <option value="8">
                    8
                  </option>
                  
                  <option value="9">
                    9
                  </option>
                  
                  <option value="10">
                    10
                  </option>
                  
                  <option value="11">
                    11
                  </option>
                  
                  <option value="12">
                    12
                  </option>
                  
                  <option value="13">
                    13
                  </option>
                  
                  <option value="14">
                    14
                  </option>
                  
                  <option value="15">
                    15
                  </option>
                  
                  <option value="16">
                    16
                  </option>
                  
                  <option value="17">
                    17
                  </option>
                  
                  <option value="18">
                    18
                  </option>
                  
                  <option value="19">
                    19
                  </option>
                  
                  <option value="20">
                    20
                  </option>
                  
                  <option value="25">
                    25
                  </option>
                  
                  <option value="30">
                    30
                  </option>
                  
                  <option value="35">
                    35
                  </option>
                  
                  <option value="40">
                    40
                  </option>
                  
                  <option value="45">
                    45
                  </option>
                  
                  <option value="50">
                    50
                  </option>
                  
                  <option value="55">
                    55
                  </option>
                  
                  <option value="60">
                    60
                  </option>
                  
                  <option value="65">
                    65
                  </option>
                  
                  <option value="70">
                    70
                  </option>
                  
                  <option value="75">
                    75
                  </option>
                  
                  <option value="80">
                    80
                  </option>
                  
                  <option value="85">
                    85
                  </option>
                  
                  <option value="90">
                    90
                  </option>
                  
                  <option value="95">
                    95
                  </option>
                  
                  <option value="100">
                    100
                  </option>
                  
                </select>
              </span>
              
            </p>
            
            <p class="data-note">
              About four hours each way.
              <br>
              For example, New York to Dallas.
            </p>
            
            <p class="data-pair">
              
              <span class="data-field">
                Long flights
              </span>
              
              <span class="data-value">
                <select name="flight_num_long" id="flight_num_long">
                  
                  <option value="0">
                    0
                  </option>
                  
                  <option value="1">
                    1
                  </option>
                  
                  <option value="2">
                    2
                  </option>
                  
                  <option value="3">
                    3
                  </option>
                  
                  <option value="4">
                    4
                  </option>
                  
                  <option value="5">
                    5
                  </option>
                  
                  <option value="6">
                    6
                  </option>
                  
                  <option value="7">
                    7
                  </option>
                  
                  <option value="8">
                    8
                  </option>
                  
                  <option value="9">
                    9
                  </option>
                  
                  <option value="10">
                    10
                  </option>
                  
                  <option value="11">
                    11
                  </option>
                  
                  <option value="12">
                    12
                  </option>
                  
                  <option value="13">
                    13
                  </option>
                  
                  <option value="14">
                    14
                  </option>
                  
                  <option value="15">
                    15
                  </option>
                  
                  <option value="16">
                    16
                  </option>
                  
                  <option value="17">
                    17
                  </option>
                  
                  <option value="18">
                    18
                  </option>
                  
                  <option value="19">
                    19
                  </option>
                  
                  <option value="20">
                    20
                  </option>
                  
                  <option value="25">
                    25
                  </option>
                  
                  <option value="30">
                    30
                  </option>
                  
                  <option value="35">
                    35
                  </option>
                  
                  <option value="40">
                    40
                  </option>
                  
                  <option value="45">
                    45
                  </option>
                  
                  <option value="50">
                    50
                  </option>
                  
                  <option value="55">
                    55
                  </option>
                  
                  <option value="60">
                    60
                  </option>
                  
                  <option value="65">
                    65
                  </option>
                  
                  <option value="70">
                    70
                  </option>
                  
                  <option value="75">
                    75
                  </option>
                  
                  <option value="80">
                    80
                  </option>
                  
                  <option value="85">
                    85
                  </option>
                  
                  <option value="90">
                    90
                  </option>
                  
                  <option value="95">
                    95
                  </option>
                  
                  <option value="100">
                    100
                  </option>
                  
                </select>
              </span>
              
            </p>
            
            <p class="data-note">
              Anything over four hours each way.
              <br>
              For example, New York to Los Angeles.
            </p>
            
            <p class="data-submit">
              
              <input type="button" id="simple_flight_calculate" name="simple_flight_calculate" value="Calculate" class="calculate">
              
            </p>
            
          </div>
          <!-- End #simple_air_controls -->
          
        </form>
        
      </div>
      <!-- End #air_controls -->
      
      <div id="air_summary" class="data-summary">
        
        <ul>
          
          <li class="active only-child">
            
            <div class="container">
              
              <p>
                <span class="flight-id">
                  Flight 1
                </span>
              </p>
              
              <p class="flight-description hidden">
                <span class="flight-num-ways">
                </span>
                &nbsp;(
                <span class="flight-miles">
                  0
                </span>
                miles)
              </p>
              
              <p class="flight-description hidden">
                <span class="flight-num-stops">
                </span>
              </p>
              
              <p class="flight-description hidden">
                <span class="flight-airline">
                </span>
                
                <span class="flight-class">
                </span>
              </p>
              
              <p class="flight-description hidden">
                <span class="flight-num-times">
                </span>
              </p>
              
            </div>
            <!-- End .container -->
            
            <p class="flight-detail hidden">
              <a href="#" class="detail button">
                <span class="rounded-left">
                  <span class="rounded-right">
                    <span class="rounded-edge">
                      Details
                    </span>
                  </span>
                </span>
              </a>
            </p>
            
            <p class="flight-bottom-line bottom-line hidden">
              
              <span class="flight-carbon-total">
                0
              </span>
              lbs CO
              <sub>
                2
              </sub>
              
            </p>
            
            <p class="flight-controls">
              
              <input type="button" name="edit_flight" value="Edit" class="edit hidden">
              
              <input type="button" id="delete_flight" value="Delete" class="delete button text-replace">
              
            </p>
            
          </li>
          
        </ul>
        
        <p class="add">
          
          <a href="#" id="add_flight" class="button disabled">
            <span class="rounded-left">
              <span class="rounded-right">
                <span class="rounded-edge">
                  Add another flight
                </span>
              </span>
            </span>
          </a>
          
        </p>
        
        <p class="next">
          
          <!--
<a href="#residential" id="homeenergynext" class="expand">
Calculate Home Energy Next
</a>
-->
          
        </p>
        
        <p class="skip-to-results hidden">
          
          <a href="#action">
            Or skip to results &raquo;
          </a>
          
        </p>
        
        <div class="selector" style="text-align:right">
          
          <a href="#residential" id="homeenergynext" class="expand">
            Calculate Home Energy Next
          </a>
          
        </div>
        
      </div>
      <!-- End #air_summary -->
      
      <div class="clear">
      </div>
      
      <p id="trx_attribution">
        Powered by 
        <a href="http:/carbon.trx.com/">
          <img src="wp-content/themes/terrapass/images/trx_logo.png" alt="TRX Travel Analytics" id="trx_logo" />
        </a>
        
      </p>
      
    </div>
    <!-- End .body -->
    
  </div>
  <!-- End #air_calculator -->
  
  <!-- * * Residential Calculator * -->
  
  <div id="residential_calculator" class="calculator-tab collapsed">
    
    <div class="header">
      
      <h2>
        Home energy 
        <span style="float: right; margin-top: -5px;font-size: 10px; font-weight: normal; color: black; text-align: right;">
          
          <a href="http://www.terrapass.com/wp-content/themes/terrapass/methodology-popup.html" target="_blank">
            Calculator methodology &raquo;
          </a>
          
        </span>
        
      </h2>
      
    </div>
    
    <div class="body">
      
      <div id="residential_controls" class="data-controls">
        
        <form action="?">
          
          <p>
            Calculate your home energy carbon footprint. 
          </p>
          
          <p class="data-pair" id="home_zip_field">
            
            <span class="data-field">
              Where is your home?
            </span>
            
            <span class="data-value">
              
              <span id="home_location">
              </span>
              
              <label for="home_zip">
                Enter your ZIP code:
              </label>
              
              <input type="text" id="home_zip" name="home_zip" value="" size="5" maxlength="5">
              
              <input type="button" id="home_zip_submit" name="home_zip_submit" value="OK" class="ok">
            </span>
            
          </p>
          
          <p class="data-pair hidden energy-use" id="home_use_gas_electricity_field">
            
            <span class="data-field">
              Most people use electricity and gas as their main home energy sources. Does this describe you?
            </span>
            
            <span class="data-value">
              <input type="radio" id="home_use_gas_electricity_yes" name="home_use_gas_electricity" value="1">
              
              <label for="home_use_gas_electricity_yes">
                Yes
              </label>
              
              <input type="radio" id="home_use_gas_electricity_no" name="home_use_gas_electricity" value="0">
              
              <label for="home_use_gas_electricity_no">
                No
              </label>
              
            </span>
            
          </p>
          
          <p class="data-pair hidden energy-use" id="home_get_combined_bill_field">
            
            <span class="data-field">
              Do you receive a combined bill for your electricity and gas?
            </span>
            
            <span class="data-value">
              <input type="radio" id="home_get_combined_bill_yes" name="home_get_combined_bill" value="1">
              
              <label for="home_get_combined_bill_yes">
                Yes
              </label>
              
              <input type="radio" id="home_get_combined_bill_no" name="home_get_combined_bill" value="0">
              
              <label for="home_get_combined_bill_no">
                No
              </label>
              
            </span>
            
          </p>
          
          <div class="data-pair hidden energy-use" id="home_get_separate_bill_field">
            
            <span class="data-field">
              What types of energy do you use in your home? Choose at least one.
            </span>
            
            <ul class="data-value">
              
              <li>
                <input type="checkbox" id="home_get_separate_bill_electricity" name="home_get_separate_bill" value="electricity">
                
                <label for="home_get_separate_bill_electricity">
                  Electricity
                </label>
              </li>
              
              <li>
                <input type="checkbox" id="home_get_separate_bill_gas" name="home_get_separate_bill" value="gas">
                
                <label for="home_get_separate_bill_gas">
                  Gas
                </label>
              </li>
              
              <li>
                <input type="checkbox" id="home_get_separate_bill_oil" name="home_get_separate_bill" value="heatingOil">
                
                <label for="home_get_separate_bill_oil">
                  Heating oil
                </label>
              </li>
              
              <li>
                <input type="checkbox" id="home_get_separate_bill_propane" name="home_get_separate_bill" value="propane">
                
                <label for="home_get_separate_bill_propane">
                  Propane
                </label>
              </li>
              
            </ul>
            
          </div>
          
          <p class="data-pair hidden avg-bill" id="home_avg_combined_bill_field">
            
            <span class="data-field">
              How much do you spend on gas and electricity in an average month?
            </span>
            
            <span class="data-value">
              $
              <input type="text" id="home_avg_combined_bill" name="home_avg_combined_bill" value="" size="6" maxlength="15">
            </span>
            
            <em class="data-note">
              Average for 
              <span class="location">
              </span>
              : 
              <span class="cost">
              </span>
            </em>
            
          </p>
          
          <p class="data-pair hidden avg-bill" id="home_avg_electricity_bill_field">
            
            <span class="data-field">
              How much do you spend on electricity in an average month?
            </span>
            
            <span class="data-value">
              $
              <input type="text" id="home_avg_electricity_bill" name="home_avg_electricity_bill" value="" size="6" maxlength="15">
            </span>
            
            <em class="data-note">
              Average for 
              <span class="location">
              </span>
              : 
              <span class="cost">
              </span>
            </em>
            
          </p>
          
          <p class="data-pair hidden avg-bill" id="home_avg_gas_bill_field">
            
            <span class="data-field">
              How much do you spend on gas in an average month?
            </span>
            
            <span class="data-value">
              $
              <input type="text" id="home_avg_gas_bill" name="home_avg_gas_bill" value="" size="6" maxlength="15">
            </span>
            
            <em class="data-note">
              Average for 
              <span class="location">
              </span>
              : 
              <span class="cost">
              </span>
            </em>
            
          </p>
          
          <p class="data-pair hidden avg-bill" id="home_avg_oil_bill_field">
            
            <span class="data-field">
              How much do you spend on heating oil each year?
            </span>
            
            <span class="data-value">
              $
              <input type="text" id="home_avg_oil_bill" name="home_avg_oil_bill" value="" size="6" maxlength="15">
            </span>
            
            <em class="data-note">
              Average for 
              <span class="location">
              </span>
              : 
              <span class="cost">
              </span>
            </em>
            
          </p>
          
          <p class="data-pair hidden avg-bill" id="home_avg_propane_bill_field">
            
            <span class="data-field">
              How much do you spend on propane each year?
            </span>
            
            <span class="data-value">
              $
              <input type="text" id="home_avg_propane_bill" name="home_avg_propane_bill" value="" size="6" maxlength="15">
            </span>
            
            <em class="data-note">
              Average for 
              <span class="location">
              </span>
              : 
              <span class="cost">
              </span>
            </em>
            
          </p>
          
          <p class="data-submit">
            
            <input type="button" id="home_calculate" name="home_calculate" value="Calculate" class="calculate disabled" disabled>
            
          </p>
          
        </form>
        
      </div>
      <!-- #residential_controls -->
      
      <div id="residential_summary" class="data-summary">
        
        <ul>
          
          <li class="active only-child">
            
            <div class="container">
              
              <h3 class="home-id">
                Home 1
              </h3>
              
              <p class="home-description hidden">
              </p>
              
            </div>
            <!-- End .container -->
            
            <p class="home-detail hidden">
              <a href="#" class="detail button">
                <span class="rounded-left">
                  <span class="rounded-right">
                    <span class="rounded-edge">
                      Details
                    </span>
                  </span>
                </span>
              </a>
            </p>
            
            <p class="home-bottom-line bottom-line hidden">
              <span class="home-carbon-total">
                0
              </span>
              lbs CO
              <sub>
                2
              </sub>
              per year
            </p>
            
            <p class="home-controls">
              
              <input type="button" name="edit_home" value="Edit" class="edit hidden">
              
              <input type="button" name="delete_home" value="Delete" class="delete button text-replace">
              
            </p>
            
          </li>
          
        </ul>
        
        <p class="add">
          <a href="#" id="add_home" class="button disabled">
            <span class="rounded-left">
              <span class="rounded-right">
                <span class="rounded-edge">
                  Add another home
                </span>
              </span>
            </span>
          </a>
        </p>
        
        <div class="selector" style="text-align:right">
          
          <a href="#action" id="seeyourresults" class="expand">
            See your results
          </a>
          
        </div>
        
      </div>
      <!-- End #residential_summary -->
      
      <div class="clear">
      </div>
      
    </div>
    <!-- End .body -->
    
  </div>
  <!-- End #residential_calculator -->
  
  <div id="take_action" class="calculator-tab collapsed">
    
    <div class="header">
      
      <h2>
        Offset your carbon footprint 
        <span style="float: right; margin-top: -5px;font-size: 10px; font-weight: normal; color: black; text-align: right;">
          
          <a href="http://www.terrapass.com/wp-content/themes/terrapass/methodology-popup.html" target="_blank">
            Calculator methodology &raquo;
          </a>
          
        </span>
        
      </h2>
      
    </div>
    
    <div class="body">
      
      <div id_="take_action_controls" id="offset_tabulation" class="data-controls">
        
        <h2>
          Offset your footprint
        </h2>
        
        <p>
          Choose elements of your carbon footprint to offset:
        </p>
        
        <form id="PRODProducts" name="PRODProducts" method="get" action="https://store.terrapass.com/store/p/56-1-000lbs-general-portfolio.html">
          
          <input type="hidden" name="qty" value="">
          
          <input type="hidden" name="vehicle_count" value="">
          
          <input type="hidden" name="flight_count" value="">
          
          <input type="hidden" name="home_count" value="">
          
          <table border="0" cellpadding="0" cellspacing="0" id="action-table">
            
            <thead>
              
            </thead>
            
            <tfoot>
              
              <tr>
                <td colspan="3">
                  <div class="blue-hr">
                    <hr>
                  </div>
                </td>
              </tr>
              
              <tr class="total">
                
                <td>
                  &nbsp;
                </td>
                
                <td>
                  <strong>
                    <span id="totalLbsCo2">
                      0
                    </span>
                    lbs CO
                    <sub>
                      2
                    </sub>
                  </strong>
                </td>
                
                <td class="total-price">
                  <strong>
                    <span id="totalPrice">
                      $0.00
                    </span>
                  </strong>
                </td>
                
              </tr>
              
              <tr>
                
                <td colspan="3" style="font-size:12px; padding-top:3px;" >
                  
                  <?php $title=urlencode('TerraPass Carbon Footprint Calculator'); $url=urlencode('https://www.facebook.com/terrapass/app_459290317417525'); $summary=urlencode('Calculate your carbon footprint'); $image=urlencode('http://www.terrapass.com/images/carbon-logo.gif'); //$message=urlencode('Try this..'); ?>
                  
                  <a onClick="window.open('http://www.facebook.com/sharer.php?s=100&amp;p[title]=
<?php echo $title;?>
&amp;p[summary]=
<?php echo $summary;?>
&amp;p[url]=
<?php echo $url; ?>
&amp;&p[images][0]=
<?php echo $image;?>
', 'sharer', 'toolbar=0,status=0,width=548,height=325');" target="_parent" href="javascript: void(0)" id="sharefacebook">
  Share Calculator on Facebook 
                  </a>
                  &nbsp;&nbsp; 
                  <!-- 
<input type="image" src="" name="" alt="Next Step &raquo;">
-->
                  
                  <a id="nextstep">
                    Next Step 
                  </a>
                  
                  <td>
                    
                </tr>
              
            </tfoot>
            
            <tbody id="declared_road">
              
              <tr class="header">
                
                <th scope="col" align="left" colspan="2">
                  Driving
                </th>
                
                <th scope="col" align="right" class="subtotal">
                  
                  <span id="vehicle_co2">
                  </span>
                  &nbsp;lbs CO
                  <sub>
                    2
                  </sub>
                  
                </th>
                
              </tr>
              
              <tr id="no_vehicles">
                
                <td>
                  &nbsp;
                </td>
                
                <td colspan="2">
                  <a href="#road" class="expand">
                    Click here to calculate
                  </a>
                </td>
                
              </tr>
              
              <tr class="sample">
                
                <td>
                  <input type="checkbox" checked onclick='checkboxOnClick()' id="actionItemCheckbox" value='ROAD,0.0'>
                </td>
                
                <td>
                  <span class="fullName">
                    &nbsp;
                  </span>
                  <br>
                  
                  <span class="lbsCO2PerYear">
                    &nbsp;
                  </span>
                  lbs CO
                  <sub>
                    2
                  </sub>
                  per year
                </td>
                
                <td class="edit">
                  <a href='?vid=${vid}#road' class="expand">
                    Edit
                  </a>
                </td>
                
              </tr>
              
            </tbody>
            
            <tbody id="declared_air">
              
              <tr class="header">
                
                <th scope="col" align="left" colspan="2">
                  Air travel
                </th>
                
                <th scope="col" align="right" class="subtotal">
                  
                  <span id="flight_co2">
                  </span>
                  &nbsp;lbs CO
                  <sub>
                    2
                  </sub>
                  
                </th>
                
              </tr>
              
              <tr id="no_flights">
                
                <td>
                  &nbsp;
                </td>
                
                <td colspan="2">
                  <a href="#air" class="expand">
                    Click here to calculate
                  </a>
                </td>
                
              </tr>
              
              <tr class="sample">
                
                <td>
                  <input type="checkbox" checked onclick='checkboxOnClick()' id="actionItemCheckbox" value='FLIGHT,0.0'>
                </td>
                
                <td>
                  <span class="milesTotal">
                    &nbsp;
                  </span>
                  miles
                  <br>
                  
                  <span class="lbsCO2PerYear">
                    &nbsp;
                  </span>
                  lbs CO
                  <sub>
                    2
                  </sub>
                  per year
                </td>
                
                <td class="edit">
                  <a href='?#air' class="expand">
                    Edit
                  </a>
                </td>
                
              </tr>
              
            </tbody>
            
            <tbody id="declared_residential">
              
              <tr class="header">
                
                <th scope="col" align="left" colspan="2">
                  Home energy
                </th>
                
                <th scope="col" align="right" class="subtotal">
                  
                  <span id="home_co2">
                  </span>
                  &nbsp;lbs CO
                  <sub>
                    2
                  </sub>
                  
                </th>
                
              </tr>
              
              <tr id="no_homes">
                
                <td>
                  &nbsp;
                </td>
                
                <td colspan="2">
                  <a href="#residential" class="expand">
                    Click here to calculate
                  </a>
                </td>
                
              </tr>
              
              <tr class="sample">
                
                <td>
                  <input type="checkbox" checked onclick='checkboxOnClick()' id="actionItemCheckbox" value='HOME,0.0'>
                </td>
                
                <td>
                  <span class="cityStateZIP">
                    &nbsp;
                  </span>
                  <br>
                  
                  <span class="lbsCO2PerYear">
                    &nbsp;
                  </span>
                  lbs CO
                  <sub>
                    2
                  </sub>
                  per year
                </td>
                
                <td class="edit">
                  <a href='?hid=${hid}#residential' class="expand">
                    Edit
                  </a>
                </td>
                
              </tr>
              
            </tbody>
            
          </table>
          
        </form>
        
        <script type="text/javascript">
          jQuery(document).ready(function($){
            $('#nextstep').click(function(){
              $('#PRODProducts').submit();
            }
                                );
            $('#PRODProducts').submit(function() {
              window.open('', 'formpopup', 'width=950,height=500,left=190px,top=110px,resizeable,scrollbars');
              this.target = 'formpopup';
            }
                                     );
          }
                                );
          function syncActionTabWithCalcTabs(){
            {
              var e;
              try{
                if(!!0){
                  console.log("actionTab.sync");
                  console.log(TPCalc.User.retrieveRoadData());
                  console.log(TPCalc.User.retrieveAirData());
                  console.log(TPCalc.User.retrieveResidentialData());
                }
              }catch(e){
                return}
            } var formatLbs = function(lbs) {
              var s = lbs.toFixed(0);
              var s_ = '';
              while(3 < s.length) {
                s_ = ','+s.slice(s.length-3)+s_;
                s = s.slice(0,s.length-3);
              }
              s_ = s+s_;
              return s_;
            }
                ; var formatMiles = formatLbs;
            (function() {
              var vehicles = TPCalc.User.retrieveRoadData().vehicles;
              var $no_vehicles = $('#no_vehicles');
              if(0 < vehicles.length) $no_vehicles.removeClass('no-vehicles');
              else $no_vehicles.addClass('no-vehicles');
              var $sample = $no_vehicles.next('tr.sample');
              $sample.siblings('.clone').remove();
              var vehicleToClone = function($clone, vid, vehicle) {
                var fullName = vehicle.year+' '+vehicle.make+' '+vehicle.model;
                var lbsCO2PerYear = vehicle.miles * vehicle.co2PerMile;
                $clone.find('span.fullName').html(fullName);
                $clone.find('span.lbsCO2PerYear').html(formatLbs(lbsCO2PerYear));
                $clone.find('#actionItemCheckbox').val('ROAD,'+lbsCO2PerYear.toFixed(2));
                $clone.find('td.edit a').attr("href",'?vid='+(vid+1)+'#road');
              }
                  ; for(var vid in vehicles) {
                    var $clone = $sample.clone(true);
                    var rid = vehicles.length-1 - vid;
                    vehicleToClone($clone, rid, vehicles[rid]);
                    $clone.insertAfter($sample).addClass('clone');
                  }
            }
            )();
            (function() {
              var airData = TPCalc.User.retrieveAirData();
              var milesTotal = 0;
              var lbsCO2PerYear = 0;
              if(airData.simple){
                var counts = airData.simpleFlightCount;
                var factors = TPCalc.Air.SIMPLE_FLIGHT_FACTORS;
                lbsCO2PerYear += counts.numShort * factors.co2LbsPerShortFlight;
                lbsCO2PerYear += counts.numMedium * factors.co2LbsPerMediumFlight;
                lbsCO2PerYear += counts.numLong * factors.co2LbsPerLongFlight;
                factors = {
                  milesPerShortFlight: 800, milesPerMediumFlight: 2750, milesPerLongFlight: 5000 }
                  ; milesTotal += counts.numShort * factors.milesPerShortFlight;
                milesTotal += counts.numMedium * factors.milesPerMediumFlight;
                milesTotal += counts.numLong * factors.milesPerLongFlight;
              }
              else{
                for (var fid in airData.flights) {
                  var flight = airData.flights[fid];
                  milesTotal += flight.miles;
                  lbsCO2PerYear += flight.co2;
                }
              }
              var $no_flights = $('#no_flights');
              if(0 < lbsCO2PerYear) $no_flights.removeClass('no-flights');
              else $no_flights.addClass('no-flights');
              var $sample = $no_flights.next('tr.sample');
              $sample.siblings('.clone').remove();
              var flightToClone = function($clone, fid, flight) {
                var milesTotal = flight.milesTotal;
                var lbsCO2PerYear = flight.lbsCO2PerYear;
                $clone.find('span.milesTotal').html(formatMiles(milesTotal));
                $clone.find('span.lbsCO2PerYear').html(formatLbs(lbsCO2PerYear));
                $clone.find('#actionItemCheckbox').val('FLIGHT,'+lbsCO2PerYear.toFixed(2));
              }
                  ; if(0 < lbsCO2PerYear) {
                    var fid = 0;
                    var $clone = $sample.clone(true);
                    var rid = 1-1 - fid;
                    flightToClone($clone, rid, {
                      milesTotal: milesTotal, lbsCO2PerYear: lbsCO2PerYear}
                                 );
                    $clone.insertAfter($sample).addClass('clone');
                  }
            }
            )();
            (function() {
              var homes = TPCalc.User.retrieveResidentialData().homes;
              var $no_homes = $('#no_homes');
              if(0 < homes.length) $no_homes.removeClass('no-homes');
              else $no_homes.addClass('no-homes');
              var $sample = $no_homes.next('tr.sample');
              $sample.siblings('.clone').remove();
              var homeToClone = function($clone, hid, home) {
                var cityStateZIP = home.city+', '+home.state+' '+home.zip;
                var lbsCO2PerYear = 0;
                for(var bid in home.bills) {
                  lbsCO2PerYear += home.bills[bid].amt * home.bills[bid].freq * home.bills[bid].usdToCo2;
                }
                $clone.find('span.cityStateZIP').html(cityStateZIP);
                $clone.find('span.lbsCO2PerYear').html(formatLbs(lbsCO2PerYear));
                $clone.find('#actionItemCheckbox').val('HOME,'+lbsCO2PerYear.toFixed(2));
                $clone.find('td.edit a').attr("href",'?hid='+(hid+1)+'#residential');
              }
                  ; for(var hid in homes) {
                    var $clone = $sample.clone(true);
                    var rid = homes.length-1 - hid;
                    homeToClone($clone, rid, homes[rid]);
                    $clone.insertAfter($sample).addClass('clone');
                  }
            }
            )();
            initActionCheckboxes();
          }
          TPCalc.syncActionTabWithCalcTabs = syncActionTabWithCalcTabs;
          function initActionCheckboxes() {
            checkboxOnClick() }
          function getCo2LbsToUsdFactor() {
            return 0.00595;
          }
          function parseCheckboxValue(value) {
            if(typeof value != 'string' || value == '') {
              return;
            }
            var parsed = value.split(",",2);
            if(!parsed || !parsed[0] || !parsed[1] || !( parsed[0] == 'ROAD' || parsed[0] == 'FLIGHT' || parsed[0] == 'HOME' )) {
              return null;
            }
            return {"category": parsed[0], "co2Lbs": parseFloat(parsed[1])}
              ; }
          function checkboxOnClick() {
            var totals = calcTotals();
            if(!totals) {
              return;
            }
            updateCategoryCounts(totals.counts);
            updateCategoryCo2Lbs(totals.catCo2Lbs);
            updateCo2LbsTotal(totals['co2Lbs']);
            updatePriceTotal(totals['co2Lbs']);
          }
          function calcTotals() {
            var form = document.forms['PRODProducts'];
            var inputs = form ? form.getElementsByTagName('input') : null;
            if(!inputs) {
              return null;
            }
            var numInputs = inputs.length;
            var totals = {'co2Lbs': 0, 'counts': {'ROAD': 0, 'FLIGHT': 0, 'HOME': 0}
                          , 'catCo2Lbs': {'ROAD': 0, 'FLIGHT': 0, 'HOME': 0}
                         };
            for(var i=0; i < numInputs; i++) {
              if(inputs[i].type == 'checkbox' && inputs[i].checked) {
                var parsed = parseCheckboxValue(inputs[i].value);
                if(parsed && totals.counts[parsed['category']] !== undefined) {
                  totals.counts[parsed['category']]++;
                  var co2Lbs = parsed['co2Lbs'];
                  totals.catCo2Lbs[parsed['category']] += co2Lbs;
                  totals.co2Lbs += co2Lbs;
                }
              }
            }
            totals.co2Lbs = Math.ceil((totals.co2Lbs) / 1000.0) * 1000.0;
            return totals;
          }
          function updatePriceTotal(totalCo2Lbs) {
            var co2ToUsdFactor = getCo2LbsToUsdFactor();
            var price = totalCo2Lbs * co2ToUsdFactor;
            var formattedPrice = (price).toFixed(2);
            var uiElem = document.getElementById('totalPrice');
            uiElem.innerHTML = '$'+formattedPrice;
          }
          function updateCategoryCounts(counts) {
            var form = document.forms['PRODProducts'];
            if(!counts) {
              return null;
            }
            var formElements = form.elements;
            formElements['vehicle_count'].value = counts['ROAD'];
            formElements['flight_count'].value = counts['FLIGHT'];
            formElements['home_count'].value = counts['HOME'];
          }
          function updateCategoryCo2Lbs(co2Lbs) {
            if(!co2Lbs) {
              return null;
            }
            var vehicleCo2Span = document.getElementById('vehicle_co2');
            if (vehicleCo2Span) {
              vehicleCo2Span.innerHTML = formatNaturalNumber(co2Lbs['ROAD']);
            }
            var flightCo2Span = document.getElementById('flight_co2');
            if (flightCo2Span) {
              flightCo2Span.innerHTML = formatNaturalNumber(co2Lbs['FLIGHT']);
            }
            var homeCo2Span = document.getElementById('home_co2');
            if (homeCo2Span) {
              homeCo2Span.innerHTML = formatNaturalNumber(co2Lbs['HOME']);
            }
          }
          function updateCo2LbsTotal(newCo2Lbs) {
            var rounded1000LbsCo2 = Math.round(newCo2Lbs/1000);
            var form = document.forms['PRODProducts'];
            var formElements = form.elements;
            formElements['qty'].value = rounded1000LbsCo2;
            var uiElem = document.getElementById('totalLbsCo2');
            uiElem.innerHTML = formatNaturalNumber(newCo2Lbs);
          }
          function formatNaturalNumber(num) {
            var str = num.toLocaleString();
            return str.replace(/\.\d+$/, '');
          }
          ; 
        </script>
        
        <!-- 
</div>
<!-- End #offset_tabulation -->
        
      </div>
      <!-- #take_action_controls -->
      
      <? /*
<div id_="take_action_summary" id="offset_sidebar" class="data-summary">

<!-- 
<div id="offset_sidebar">

<!-- -->

<div id="signup_section" class="section">

<h3>
<img src="wp-content/themes/terrapass/images/blogposts-mailbox.gif" alt="&raquo;">
Sign up for weekly updates
</h3>

<form id="signup_form" method="post" action="/newsletter/signup_postback.php">

<input type="hidden" name="fn" value="Mail_LandingPage_Subadd">

<input type="hidden" name="type" value="p">

<input type="hidden" name="page" value="subadd">

<input type="hidden" name="id" value="1fl8vkzw748g4wdx3yqsbrboycoje">

<input type="hidden" name="ssid" value="6429">

<p>
<strong>
Free
</strong>
tips to lower your carbon footprint, thought-provoking news and opinions.
</p>

<table border="0" cellspacing="0" cellpadding="0">

<tbody>

<tr>

<td>
<input type="text" id="signup_email" name="email" value="Your main email address" onfocus="gainFocus(this);" onBlur="loseFocus(this);">
</td>

<td>
<input type="image" name="" src="wp-content/themes/terrapass/images/blogposts-sign-up-button.gif" alt="Sign up">
</td>

</tr>

<tr class="notation">

<td>
Your privacy is 
<a href="/the-footprint-blog/newsletter-privacy/">
safe
</a>
.
</td>

<td>
See a 
<a href="/the-footprint-blog/newsletter/#sample">
sample
</a>
.
</td>

</tr>

</table>

</form>

</div>
<!-- End .section -->

<!-- 
</div>
<!-- End #offset_sidebar -->

</div>
<!-- End #take_action_summary -->
*/?>
      
      <div class="clear">
      </div>
      
    </div>
    <!-- End .body -->
    
  </div>
  <!-- End #take_action -->
  
  <div class="clear">
  </div>
  
  </div>
  <!-- End #calculator_cluster-->
  
  <!-- ********** END CALCULATOR CODE ********** -->
  
  </div>
  
  </body>
  