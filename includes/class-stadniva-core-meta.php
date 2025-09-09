<?php
/**
 * Abstract Class for creating meta boxes using the CodeStart Framework.
 *
 * This file contains an abstract class which provides the foundation
 * for creating meta boxes in the Stadniva Core plugin.
 *
 * @since      0.9.0
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/includes
 * @author     Ammar Nasir <info@domain.com>
 */
abstract class Stadniva_Core_Meta {
	/**
	 * Prefix for service questions.
	 *
	 * @var string
	 */
	private $prefix = 'stdn-service-questions';

	/**
	 * Post type.
	 *
	 * @var string
	 */
	protected $post_type = 'stdn-services';

	/**
	 * Member prefix for service questions.
	 *
	 * @var string
	 */
	private $mem_prefix = 'stdn-service-questions-m';

	/**
	 * Constructor for the class.
	 *
	 * @param string $plugin_name The name of the plugin.
	 */
	public function __construct( $plugin_name ) {
		$this->prefix = $plugin_name;

		$this->init_meta();
		$this->introduce_tabs();
		$this->admin_init();
	}

	/**
	 * Method to create admin options
	 *
	 * @return void
	 */
	private function admin_init() {}

	/**
	 * Method to create metabox
	 *
	 * @return void
	 */
	private function init_meta() {
		CSF::createMetabox(
			$this->prefix,
			array(
				'title'     => __( $this->meta_title, 'stadniva-core' ),
				'post_type' => $this->post_type,
			)
		);
	}

	/**
	 * Method to populate the metabox
	 *
	 * @return void
	 */
	private function introduce_tabs() {
		$tabs = $this->get_fields();
		foreach ( $tabs as $tab ) {
			CSF::createSection( $this->prefix, $tab );
		}
	}
}
