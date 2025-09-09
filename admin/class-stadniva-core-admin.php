<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://designingmedia.com/
 * @since      1.0.0
 *
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/admin
 * @author     Ammar Nasir <info@domain.com>
 */
class Stadniva_Core_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function stdn_enqueue_styles() {
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Stadniva_Core_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Stadniva_Core_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/stadniva-core-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function stdn_enqueue_scripts() {
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Stadniva_Core_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Stadniva_Core_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/stadniva-core-admin.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Method to print data using print_r.
	 *
	 * @param mixed $data Data to be printed.
	 */
	public function pre( $data ) {
		echo '<pre>';
		print_r( $data );
		exit;
	}

	/**
	 * Callback method of init hook
	 */
	public function stdn_init_hook_callback() {

		/**
		 * Stadniva Service post type
		 */
		$this->stdn_custom_post_type();

		/**
		 * Stadnive Service taxonomy
		 */
		$this->stdn_service_category_taxonomy();
	}

	/**
	 * Method to create Service custom post type
	 */
	private function stdn_custom_post_type() {
		$labels = array(
			'name'                  => _x( 'Services', 'Post Type General Name', 'stadniva-core' ),
			'singular_name'         => _x( 'Service', 'Post Type Singular Name', 'stadniva-core' ),
			'menu_name'             => __( 'Services', 'stadniva-core' ),
			'name_admin_bar'        => __( 'Service', 'stadniva-core' ),
			'archives'              => __( 'Service Archives', 'stadniva-core' ),
			'attributes'            => __( 'Service Attributes', 'stadniva-core' ),
			'parent_item_colon'     => __( 'Parent Service:', 'stadniva-core' ),
			'all_items'             => __( 'All Services', 'stadniva-core' ),
			'add_new_item'          => __( 'Add New Service', 'stadniva-core' ),
			'add_new'               => __( 'Add New', 'stadniva-core' ),
			'new_item'              => __( 'New Service', 'stadniva-core' ),
			'edit_item'             => __( 'Edit Service', 'stadniva-core' ),
			'update_item'           => __( 'Update Service', 'stadniva-core' ),
			'view_item'             => __( 'View Service', 'stadniva-core' ),
			'view_items'            => __( 'View Services', 'stadniva-core' ),
			'search_items'          => __( 'Search Service', 'stadniva-core' ),
			'not_found'             => __( 'Not found', 'stadniva-core' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'stadniva-core' ),
			'featured_image'        => __( 'Featured Image', 'stadniva-core' ),
			'set_featured_image'    => __( 'Set featured image', 'stadniva-core' ),
			'remove_featured_image' => __( 'Remove featured image', 'stadniva-core' ),
			'use_featured_image'    => __( 'Use as featured image', 'stadniva-core' ),
			'insert_into_item'      => __( 'Insert into service', 'stadniva-core' ),
			'uploaded_to_this_item' => __( 'Uploaded to this service', 'stadniva-core' ),
			'items_list'            => __( 'Services list', 'stadniva-core' ),
			'items_list_navigation' => __( 'Services list navigation', 'stadniva-core' ),
			'filter_items_list'     => __( 'Filter services list', 'stadniva-core' ),
		);

		$args = array(
			'label'               => __( 'Service', 'stadniva-core' ),
			'description'         => __( 'Post Type Description', 'stadniva-core' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields' ),
			'taxonomies'          => array( 'service_category' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'show_in_rest'        => true,
		);
		register_post_type( 'stdn-services', $args );
	}

	/**
	 * Method to create taxonomy for service post type
	 */
	public function stdn_service_category_taxonomy() {
		$labels = array(
			'name'                       => _x( 'Service Categories', 'Taxonomy General Name', 'stadniva-core' ),
			'singular_name'              => _x( 'Service Category', 'Taxonomy Singular Name', 'stadniva-core' ),
			'menu_name'                  => __( 'Service Categories', 'stadniva-core' ),
			'all_items'                  => __( 'All Categories', 'stadniva-core' ),
			'parent_item'                => __( 'Parent Category', 'stadniva-core' ),
			'parent_item_colon'          => __( 'Parent Category:', 'stadniva-core' ),
			'new_item_name'              => __( 'New Category Name', 'stadniva-core' ),
			'add_new_item'               => __( 'Add New Category', 'stadniva-core' ),
			'edit_item'                  => __( 'Edit Category', 'stadniva-core' ),
			'update_item'                => __( 'Update Category', 'stadniva-core' ),
			'view_item'                  => __( 'View Category', 'stadniva-core' ),
			'separate_items_with_commas' => __( 'Separate categories with commas', 'stadniva-core' ),
			'add_or_remove_items'        => __( 'Add or remove categories', 'stadniva-core' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'stadniva-core' ),
			'popular_items'              => __( 'Popular Categories', 'stadniva-core' ),
			'search_items'               => __( 'Search Categories', 'stadniva-core' ),
			'not_found'                  => __( 'Not Found', 'stadniva-core' ),
			'no_terms'                   => __( 'No categories', 'stadniva-core' ),
			'items_list'                 => __( 'Categories list', 'stadniva-core' ),
			'items_list_navigation'      => __( 'Categories list navigation', 'stadniva-core' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => true,
			'show_in_rest'      => true,
		);
		register_taxonomy( 'service_category', array( 'stdn-services' ), $args );
	}
}
