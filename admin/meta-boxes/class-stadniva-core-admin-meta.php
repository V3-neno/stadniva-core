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
class Stadniva_Core_Admin_Meta extends Stadniva_Core_Meta {

	/**
	 * The title for the meta box.
	 *
	 * @var string
	 */
	protected $meta_title = 'Service Additional Informations';

	/**
	 * The post type associated with the meta box.
	 *
	 * @var string
	 */
	protected $post_type = 'stdn-services';

	/**
	 * Return array of tabs or single tab fields to be rendered
	 *
	 * @return array
	 */
	protected function get_fields() {

		$tabs[] = array(
			'title'  => __( 'Service Settings', 'stadniva-core' ),
			'fields' => array(

				array(
					'id'     => 'stdn-price-repeater',
					'type'   => 'repeater',
					'title'  => __( 'Prices', 'stadniva-core' ),
					'fields' => array(

						array(
							'id'    => 'stdn-kvm-range',
							'type'  => 'text',
							'title' => __( 'KVM Range', 'stadniva-core' ),
						),

						array(
							'id'    => 'stdn-service-price',
							'type'  => 'number',
							'title' => __( 'Service Price', 'stadniva-core' ),
						),
					),
				),

				array(
					'id'     => 'stdn-option-repeater',
					'type'   => 'repeater',
					'title'  => __( 'Options', 'stadniva-core' ),
					'fields' => array(

						array(
							'id'    => 'stdn-drpdn-option',
							'type'  => 'text',
							'title' => __( 'Dropdown Option', 'stadniva-core' ),
						),
					),
				),

				array(
					'id'    => 'opt-switcher',
					'type'  => 'switcher',
					'title' => 'Add ROK Options',
				),

				array(
					'id'     => 'stdn-rok-repeater',
					'type'   => 'repeater',
					'title'  => __( 'ROK', 'stadniva-core' ),
					'dependency' => array( 'opt-switcher', '==', 'true' ),
					'fields' => array(

						array(
							'id'    => 'stdn-rok',
							'type'  => 'text',
							'title' => __( 'ROK', 'stadniva-core' ),
						),

						array(
							'id'    => 'stdn-rok-price',
							'type'  => 'number',
							'title' => __( 'ROK Price', 'stadniva-core' ),
						),
					),
				),

				array(
					'id'     => 'stdn-checkbox-repeater',
					'type'   => 'repeater',
					'title'  => __( 'Additional Option', 'stadniva-core' ),
					'dependency' => array( 'opt-switcher', '==', 'true' ),
					'fields' => array(

						array(
							'id'    => 'stdn-checkbox-option',
							'type'  => 'text',
							'title' => __( 'Checkbox Option', 'stadniva-core' ),
						),
					),
				),

				array(
					'id'      => 'stdn-moving-service',
					'type'    => 'checkbox',
					'title'   => __( 'Moving service', 'stadniva-core' ),
					'default' => false,
				),

				// Contact Form 7 shortcode to render booking form
				array(
					'id'    => 'stdn-cf7-shortcode',
					'type'  => 'text',
					'title' => __( 'CF7 Shortcode', 'stadniva-core' ),
					'desc'  => __( 'Paste a Contact Form 7 shortcode, e.g. [contact-form-7 id="123"].', 'stadniva-core' ),
				),
			),
		);

		$tabs[] = array(
			'title'  => __( 'Service Additional Information', 'stadniva-core' ),
			'fields' => array(
				array(
					'id'    => 'stdn-service-main-info',
					'type'  => 'wp_editor',
					'title' => __( 'Basic Info', 'stadniva-core' ),
				),

				array(
					'id'    => 'stdn-service-tooltip-info',
					'type'  => 'wp_editor',
					'title' => __( 'Tooltip Info', 'stadniva-core' ),
				),

				array(
					'id'    => 'stdn-service-info-icon',
					'type'  => 'upload',
					'title' => __( 'Icon', 'stadniva-core' ),
				),
			),
		);

		$tabs[] = array(
			'title'  => __( 'Service Questions', 'stadniva-core' ),
			'fields' => array(
				array(
					'id'     => 'stdn-additional-info-repeater',
					'type'   => 'repeater',
					'title'  => __( 'Add Questions for service', 'stadniva-core' ),
					'fields' => array(

						array(
							'id'    => 'stdn-service-question',
							'type'  => 'text',
							'title' => __( 'Question Title', 'stadniva-core' ),
						),

						array(
							'id'      => 'stdn-question-required',
							'type'    => 'checkbox',
							'title'   => __( 'Required?', 'stadniva-core' ),
							'label'   => __( 'Yes, Please do it.', 'stadniva-core' ),
							'default' => false,
						),

						array(
							'id'      => 'stdn-previous-child',
							'type'    => 'checkbox',
							'title'   => __( 'Child of previous?', 'stadniva-core' ),
							'label'   => __( 'Yes, Please do it.', 'stadniva-core' ),
							'default' => false,
						),

						array(
							'id'      => 'stdn-service-question-type',
							'type'    => 'select',
							'title'   => __( 'Question Type', 'stadniva-core' ),
							'options' => array(
								'text'     => 'Text',
								'number'   => 'Number',
								'select'   => 'Select',
								'checkbox' => 'Checkbox',
								'radio'    => 'Radio',
							),
						),

						array(
							'id'         => 'stdn-service-question-options',
							'type'       => 'group',
							'title'      => __( 'Options', 'stadniva-core' ),
							'dependency' => array( 'stdn-service-question-type', 'any', 'select,checkbox,radio' ),
							'fields'     => array(
								array(
									'id'    => 'stdn-service-option-value',
									'type'  => 'text',
									'title' => __( 'Option Value', 'stadniva-core' ),
								),

								array(
									'id'    => 'stdn-service-price',
									'type'  => 'text',
									'title' => __( 'Price', 'stadniva-core' ),
								),
							),
						),

					),
				),
			),
		);

		return $tabs;
	}
}