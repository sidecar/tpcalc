<?php

/**

 * The base configurations of the WordPress.

 *

 * This file has the following configurations: MySQL settings, Table Prefix,

 * Secret Keys, WordPress Language, and ABSPATH. You can find more information

 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing

 * wp-config.php} Codex page. You can get the MySQL settings from your web host.

 *

 * This file is used by the wp-config.php creation script during the

 * installation. You don't have to use the web site, you can just copy this file

 * to "wp-config.php" and fill in the values.

 *

 * @package WordPress

 */

define('WP_MEMORY_LIMIT','128M');


// ** MySQL settings - You can get this info from your web host ** //

/** The name of the database for WordPress */

//define('DB_NAME', 'terrapas_terrapass');
define('DB_NAME', 'terrapas_dec2012');



/** MySQL database username */

define('DB_USER', 'terrapas_datause');


/** MySQL database password */

define('DB_PASSWORD', 'pbc{]0Ma3eJ5');



/** MySQL hostname */

define('DB_HOST', 'localhost');



/** Database Charset to use in creating database tables. */

define('DB_CHARSET', 'utf8');



/** The Database Collate type. Don't change this if in doubt. */

define('DB_COLLATE', '');



/**#@+

 * Authentication Unique Keys and Salts.

 *

 * Change these to different unique phrases!

 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}

 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.

 *

 * @since 2.6.0

 */

define('AUTH_KEY',         '[uFcM4L+[@PReWGlJx]xW:n@G-$d!=/X?QH{|Q83b:,0@Ve.`pN*^G,O:NOrO|P*');

define('SECURE_AUTH_KEY',  'zV6yD9*8N^;wxtW0T(/TD[H~Y]h!l4q|vwq|B3R|2y1wl,bpXg3r>t:cLuSW0zN,');

define('LOGGED_IN_KEY',    '}fp$0^R,?Y+XZrVx4T+:{[KZeL|IQ-L-f=2/jTMuycTj|0jXcGSvsy0Wvzk9+dkT');

define('NONCE_KEY',        'UAN:bo7^xHK/D?#uOsosX&i2sc#_f3&KLyct$L?$|$1XbDv)|)qZM@FHUVh?o&y-');

define('AUTH_SALT',        'BkA/0%{P!m.$7tnA{LN8&vZQlPzo _2&mVDuoE*;zRsEu|HJ3b@.@4u!0f(H3 /:');

define('SECURE_AUTH_SALT', 'Bo)=|MAZM!]a`oFL{QoYhDPs>/3J9J} j2c_c!lpt!!DtQ@NP2*f&Qu:p%wV^R;3');

define('LOGGED_IN_SALT',   '%]/KPQi:-}I&B*V>}+ny0=9/_V!%^=IV2?B,>MCG*z9lDi3?||sSZFu-e{D~BjI|');

define('NONCE_SALT',       'mT+G0naKNCTsG 0]H*-jY|}EL0-@_;7MOq@K4jE^K_ROIBr`^83$W#*`c/%F1^R(');



/**#@-*/



/**

 * WordPress Database Table prefix.

 *

 * You can have multiple installations in one database if you give each a unique

 * prefix. Only numbers, letters, and underscores please!

 */

$table_prefix  = 'wp_tp_';



/**

 * WordPress Localized Language, defaults to English.

 *

 * Change this to localize WordPress. A corresponding MO file for the chosen

 * language must be installed to wp-content/languages. For example, install

 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German

 * language support.

 */

define('WPLANG', '');



/**

 * For developers: WordPress debugging mode.

 *

 * Change this to true to enable the display of notices during development.

 * It is strongly recommended that plugin and theme developers use WP_DEBUG

 * in their development environments.

 */

define('WP_DEBUG', false);



/* That's all, stop editing! Happy blogging. */



/** Absolute path to the WordPress directory. */

if ( !defined('ABSPATH') )

	define('ABSPATH', dirname(__FILE__) . '/');



/** Sets up WordPress vars and included files. */

//require_once(ABSPATH . 'wp-settings.php');

