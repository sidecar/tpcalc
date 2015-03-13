<?php

/*
*/
ini_set('display_errors', 1);
error_reporting(E_ALL);

$trees = intval($_REQUEST['trees']);
$co2e_site = intval($_REQUEST['co2e_site']);
$co2e_fleet = intval($_REQUEST['co2e_fleet']);
$co2e_travel = intval($_REQUEST['co2e_travel']);
$co2e_commute = intval($_REQUEST['co2e_commute']);
$co2e_shipping = intval($_REQUEST['co2e_shipping']);
$co2e_server = intval($_REQUEST['co2e_server']);

$co2e_total =
$co2e_site +
$co2e_fleet +
$co2e_travel +
$co2e_commute +
$co2e_shipping +
$co2e_server ;

$co2e_site_percentage = ($co2e_site > 0 ? $co2e_site/$co2e_total : 0);
$co2e_fleet_percentage = ($co2e_fleet > 0 ? $co2e_fleet/$co2e_total : 0);
$co2e_travel_percentage = ($co2e_travel > 0 ? $co2e_travel/$co2e_total : 0);
$co2e_commute_percentage = ($co2e_commute > 0 ? $co2e_commute/$co2e_total : 0);
$co2e_shipping_percentage = ($co2e_shipping > 0 ? $co2e_shipping/$co2e_total : 0);
$co2e_server_percentage = ($co2e_server > 0 ? $co2e_server/$co2e_total : 0);

$co2e_site_pixels = $co2e_site_percentage*250;
$co2e_fleet_pixels = $co2e_fleet_percentage*250;
$co2e_travel_pixels = $co2e_travel_percentage*250;
$co2e_commute_pixels = $co2e_commute_percentage*250;
$co2e_shipping_pixels = $co2e_shipping_percentage*250;
$co2e_server_pixels = $co2e_server_percentage*250;

$emailAddr = $_REQUEST['emailAddr'];

?>

<?
// <style type="text/css">
// #outlook a {
//     padding: 0;
// }

// body {
//     width: 100%;
//     margin: 0;
//     padding: 0;
// }

// .ExternalClass {
//     width: 100%;
// }

// .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
//     line-height: 100%;
// }

// #backgroundTable {
//     margin: 0;
//     padding: 0;
//     width: 100%;
//     line-height: 100%;
// }
// h1, h2, h3, h4, h5, p {
//     margin: 0;
//     padding: 0;
//     font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif;
//     vertical-align: baseline;
//     -moz-text-size-adjust: none;
//     -webkit-text-size-adjust: none;
//     -ms-text-size-adjust: none;
// }
// h1 {
//     color: #124c9e;
//     font-size: 160px;
//     font-weight: 100;
//     letter-spacing: 1px;
// }
// h2 {
//     color: #124c9e;
//     font-size: 33px;
//     font-weight: 100;
//     letter-spacing: 1.4px
// }
// h3 {
//     font-size: 24.5px;
//     font-weight: bold;
//     letter-spacing: 9px;
// }
// h4 {
//     font-size: 37px;
//     font-weight: bold;
//     letter-spacing: 1.4px
// }
// h5 {
//     font-style: italic;
//     font-size: 27.14px;
//     font-weight: 100;
// }
// p {
//     line-height: 1.2;
//     color: #3c3c3c;
//     font-size: 14.58px;
//     font-weight: 100;
//     letter-spacing: 2px
// }
// table td {
//     border-collapse: collapse;
// }

// /***************************************************
// ****************************************************
// MOBILE TARGETING

// Use @media queries with care.  You should not bring these styles inline -- so it's recommended to apply them AFTER you bring the other stlying inline.

// Note: test carefully with Yahoo.
// Note 2: Don't bring anything below this line inline.
// ****************************************************
// ***************************************************/

// /* NOTE: To properly use @media queries and play nice with yahoo mail, use attribute selectors in place of class, id declarations.
// table[class=classname]
// Read more: http://www.campaignmonitor.com/blog/post/3457/media-query-issues-in-yahoo-mail-mobile-email/
// */
// @media only screen and (max-device-width: 480px) {

//      A nice and clean way to target phone numbers you want clickable and avoid a mobile phone from linking other numbers that look like, but are not phone numbers.  Use these two blocks of code to "unstyle" any numbers that may be linked.  The second block gives you a class to apply with a span tag to the numbers you would like linked and styled.

//     Inspired by Campaign Monitor's article on using phone numbers in email: http://www.campaignmonitor.com/blog/post/3571/using-phone-numbers-in-html-email/.

//     Step 1 (Step 2: line 224)

//     a[href^="tel"], a[href^="sms"] {
//                 text-decoration: none;
//                 color: black; /* or whatever your want */
//                 pointer-events: none;
//                 cursor: default;
//             }

//     .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
//                 text-decoration: default;
//                 color: orange !important; /* or whatever your want */
//                 pointer-events: auto;
//                 cursor: default;
//             }

//     #address {
//         color: #FFFFFF !important;
//         text-decoration: none !important;
//     }
// }

// /* More Specific Targeting */

// @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
//     /* You guessed it, ipad (tablets, smaller screens, etc) */

//     /* Step 1a: Repeating for the iPad */
//     a[href^="tel"], a[href^="sms"] {
//                 text-decoration: none;
//                 color: blue; /* or whatever your want */
//                 pointer-events: none;
//                 cursor: default;
//             }

//     .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
//                 text-decoration: default;
//                 color: orange !important;
//                 pointer-events: auto;
//                 cursor: default;
//             }
// }

// @media only screen and (-webkit-min-device-pixel-ratio: 2) {
//     /* Put your iPhone 4g styles in here */
//     #bubbleContent {
//         line-height: 1.2;
//     }

//     #address {
//         color: #FFFFFF !important;
//         text-decoration: none !important;
//     }
// }

// /* Following Android targeting from:
// http://developer.android.com/guide/webapps/targeting.html
// http://pugetworks.com/2011/04/css-media-queries-for-targeting-different-mobile-devices/  */
// @media only screen and (-webkit-device-pixel-ratio:.75){
//     /* Put CSS for low density (ldpi) Android layouts in here */
// }
// @media only screen and (-webkit-device-pixel-ratio:1){
//     /* Put CSS for medium density (mdpi) Android layouts in here */
// }
// @media only screen and (-webkit-device-pixel-ratio:1.5){
//     /* Put CSS for high density (hdpi) Android layouts in here */
// }
// </style>

?>

<?php

//START Send Email to selected recipient

  ini_set("SMTP", "10.1.2.74");
  ini_set("smtp_port", "25");

  $from = 'support@terrapass.com';
  //$recipient = 'jed@swirl.net';
  $recipient = $emailAddr;
  $subject = 'Thank you for calculating your footprint with TerraPass. Here is your emissions profile.';

  $treesSet = '';
  $i=0;
  while($i<$trees) {

    $treesSet .= '<img src="http://swirlreview.com/clients/images/terrapass/email/_images/icon_tree_20x32.png" alt="" title="" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" />';

    $i++;

    if($i % 36 == 0) {
      $treesSet .= "<br>";
    }

  }

  //echo "trees: ".$trees."<br>";
  //echo $treesSet;
  //exit;

  $message = '
  <html>
  <body>
  <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; line-height: 100%; margin: 0; padding: 0;">
      <tr>
        <td width="1000" style="padding: 20px 18px;"><table width="962" cellpadding="0" cellspacing="0" border="0" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 20px 18px; border-collapse:collapse">
            <tr><!-- Width of email inside the gray border -->
            <td width="952" align="center" style="padding: 43px 0 0;"><a href="http://www.terrapass.com" target="new"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/logo_terrapass_313x62.png" alt="Terrapass" title="Terrapass" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" /></a></td>
          </tr>
            <tr>
            <td width="952" align="center" style="padding: 8px 0 0;"><h1 style="text-wrap: none; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 160px; line-height:1.2; font-weight: 100; letter-spacing: 1px; color: #124c9e; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">Thank you!</h1></td>
          </tr>
            <tr>
            <td width="952" align="center" style="padding: 2px 0 0;"><h2 style="line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 33px; line-height:1.2; font-weight: 100; letter-spacing: 1.4px; color: #124c9e; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">for joining us in the fight against climate change</h2></td>
          </tr>
            <tr>
            <td width="952" align="left" style="padding: 32px 109px 28px;"><p style="line-height: 1.2; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #3c3c3c; font-size: 14.58px; font-weight: 100; letter-spacing: 2px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">Thanks for taking the step towards lowering your carbon footprint. Check out your carbon profile below. Every offset you purchase helps keep carbon out of our atmosphere.</p></td>
          </tr>
            <tr>
            <td width="952" align="center">
              <table cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse">
              <tr>
                <td align="left">

                '.$treesSet.'

                </td>
              </tr>
              </table>
            </td>
          </tr>
            <tr>
            <td width="952" align="center" style="padding: 20px 0 38px;"><p style="line-height: 1.2; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #3c3c3c; font-size: 14.58px; font-weight: 100; letter-spacing: 2px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">Your carbon footprint is the equivalent of planting '.number_format($trees).' urban trees.</p></td>
          </tr>
            <tr>
            <td width="952" style="padding: 0 0 0 135px;"><table width="817" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse:collapse">
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #1E0770; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">SITE</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_site.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="41" /></td>
                  <td width="387" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #1E0770; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_site).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #0a61ae; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">FLEET</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_fleet.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="49" /></td>
                  <td width="450" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #0a61ae; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_fleet).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #2ba7e5; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">TRAVEL</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_travel_bus.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="52" /></td>
                  <td width="450" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #2ba7e5; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_travel).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #41ad49; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">COMMUTE</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_commute.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="46" /></td>
                  <td width="450" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #41ad49; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_commute).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #1d7768; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">SHIPPING</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_shipping.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="46" /></td>
                  <td width="450" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #1d7768; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_shipping).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td width="315" valign="middle"><h3 style="color: #91C03F; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 24.5px; font-weight: bold; letter-spacing: 4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">SERVER</h3></td>
                  <td width="52"><img src="http://www.terrapass.com/tpcalc.services/email/img/ico_server.png" alt="" title="" border="0" style="display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0;" height="46" /></td>
                  <td width="450" valign="middle" style="padding: 0 0 0 63px;"><h4 style="color: #91C03F; font-weight: 100; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 37px; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_server).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="29" style="height: 29px; line-height: 29px;"></td>
                </tr>
                <tr>
                  <td colspan="2" valign="middle"><h4 style="color: #2575be; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-style: italic; font-size: 36px; font-weight: 100; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">Your total carbon footprint</h4></td>
                  <td width="450" valign="middle" style="padding: 0;"><h4 style="color: #2575be; font-weight: 100; font-size: 46px; line-height: 100%; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; letter-spacing: 1.4px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">'.number_format($co2e_total).' lbs CO2e</h4></td>
                </tr>
                <tr>
                  <td colspan="3" height="20" style="height: 20px; line-height: 20px;"></td>
                </tr>

              </table></td>
          </tr>
            <tr>
            <td width="952" align="center" style="margin: 0 auto; padding: 36px 0 17px;">
              <table cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse">
              <tr>
                <td width="374" height="25"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/roundedBox_top_374x25.png" border="0" style="display:block" /></td>
              </tr>
              <tr>
                <td width="354" bgcolor="#0A61AD" align="center" style="padding: 0 10px"><a href="http://www.terrapass.com/shop/" id="bubbleContent" style="color: #FFFFFF; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; font-size: 25px; line-height:1; font-weight: 500; text-decoration: none; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding:0;">PURCHASE OFFSETS NOW FOR $5.95 PER 1,000 LBS</a></td>
              </tr>
              <tr>
                <td width="374"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/roundedBox_bottom_374x25.png" border="0" style="display:block" alt="" title="" /></td>
              </tr>
              </table>
            </td>
          </tr>
            <tr>
            <td width="952" align="center" style="padding: 0 0 8px;"><p style="line-height: 1.2; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #3c3c3c; font-size: 14.58px; font-weight: 100; letter-spacing: 2px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">To get more Terrapass updates, <a href="#" target="new" style="color:#0d4b9c">click here</a> to subscribe to our mailing list.</p></td>
          </tr>
            <tr>
            <td bgcolor="#2295D6" width="952" align="center"><table cellpadding="0" cellspacing="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse:collapse">
                <tr>
                  <td width="952" height="16" style="height: 16px; line-height: 16px; mso-line-height-rule: exactly;"></td>
                </tr>
                <tr>
                  <td height="40" width="952" align="center">
                    <table cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse">
                    <tr>
                      <td width="48" height="40"><a href="https://www.linkedin.com/company/85641" target="new"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/icon_linkedIn_48x40.png" alt="LinkedIn" title="LinkedIn" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0; display:block" /></a></td>
                      <td width="55" height="40"><a href="http://www.pinterest.com/terrapass" target="new"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/icon_pinterest_55x40.png" alt="Pinterest" title="Pinterest" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0; display:block" /></a></td>
                      <td width="56" height="40"><a href="https://twitter.com/terrapass" target="new"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/icon_twitter_56x40.png" alt="Twitter" title="Twitter" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0; display:block" /></a></td>
                      <td width="47" height="40"><a href="https://www.facebook.com/terrapass" target="new"><img src="http://swirlreview.com/clients/images/terrapass/email/_images/icon_facebook_47x40.png" alt="Facebook" title="Facebook" border="0" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: 0; padding: 0; display:block" /></a></td>
                    </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="952" height="4" style="height: 4px; line-height: 4px; mso-line-height-rule: exactly;"></td>
                </tr>
                <tr>
                  <td width="952" align="center">
                    <table cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse:collapse">
                    <tr>
                      <td width="463" align="right"><p style="vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #ffffff; font-size: 13px; font-weight: 100; font-style:italic; letter-spacing:0px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;"><em>Copyright &copy; 2014 TerraPass, Inc. All Rights Reserved</em></p></td>
                      <td width="26">&nbsp;</td>
                      <td width="463" align="left"><p style="vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #ffffff; font-size: 13px; font-weight: 100; letter-spacing:0px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;"><a href="https://twitter.com/terrapass" target="new" style="color:#FFFFFF;">follow on Twitter</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://www.facebook.com/terrapass" target="new" style="color:#FFFFFF;">friend on Facebook</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#" target="new" style="color:#FFFFFF">forward to a friend</a></p></td>
                    </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="952" height="16" style="height: 16px; line-height: 16px; mso-line-height-rule: exactly;"></td>
                </tr>
                <tr>
                  <td width="952" align="center"><p id="address" style="line-height: 1.2; vertical-align: baseline; font-family: \'Myriad Pro\', \'Lucida Grande\', \'Lucida Sans Unicode\', Arial, sans-serif; color: #ffffff; font-size: 13px; font-weight: 100; font-style:italic; letter-spacing:0px; -moz-text-size-adjust: none; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">527 Howard St, San Francisco, CA 94105&nbsp;&nbsp;&bull;&nbsp;&nbsp;877.210.9581</p></td>
                </tr>
                <tr>
                  <td width="952" height="12" style="height: 12px; line-height: 12px; mso-line-height-rule: exactly;"></td>
                </tr>
              </table></td>
          </tr>
          </table></td>
      </tr>
    </table>
    <!-- End of wrapper table -->
  </body>
  </html>';

  $headers = 'From: '.$from."\n".'Reply-To: '.$from. "\n" .'X-Mailer: PHP/' . phpversion();
  $headers .= 'Content-type: text/html; charset=ISO-8859-1' . "\n";
  $headers .= 'MIME-Version: 1.0' . "\n";
  //$headers .= 'Cc: '."jed@swirl.net". "\r\n";

  // In case any of our lines are larger than 70 characters, we should use wordwrap()
  // $message = wordwrap($message, 70);

  //echo $message;
  //exit;

  // Send
  mail($recipient, $subject, $message, $headers);

  $terrapass  = 'nbsales@terrapass.com' . ', ';
  $terrapass .= 'kristi@terrapass.com';

  mail($terrapass, 'Terrapass Business Calculator Submission', 'The individual calculator was completed by '.$recipient, $headers);

  // ADD CODE HERE TO HANDLE WHAT HAPPENS AFTER SUBMIT

//END Send Email to selected recipient

?>