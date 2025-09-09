<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://http://designingmedia.com/
 * @since             1.0.0
 * @package           Stadniva_Core
 *
 * @wordpress-plugin
 * Plugin Name:       Stadniva Core
 * Plugin URI:        https://designingmedia.com/
 * Description:       This plugin will manage the core functionalities of stadniva.
 * Version:           1.0.3
 * Author:            Ammar Nasir
 * Author URI:        https://http://designingmedia.com//
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       stadniva-core
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'STADNIVA_CORE_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-stadniva-core-activator.php
 */
function activate_stadniva_core() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stadniva-core-activator.php';
	Stadniva_Core_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-stadniva-core-deactivator.php
 */
function deactivate_stadniva_core() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stadniva-core-deactivator.php';
	Stadniva_Core_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_stadniva_core' );
register_deactivation_hook( __FILE__, 'deactivate_stadniva_core' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-stadniva-core.php';

/**
 * Codestar Framework include
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/codestar-framework/classes/setup.class.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_stadniva_core() {
	$plugin = new Stadniva_Core();
	$plugin->run();
}
run_stadniva_core();
