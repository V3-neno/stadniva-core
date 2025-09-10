<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://designingmedia.com/
 * @since      1.0.0
 *
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/public
 */

if ( session_status() === PHP_SESSION_NONE ) {
	session_start();
}
/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/public
 * @author     Ammar Nasir <info@domain.com>
 */
class Stadniva_Core_Public {

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
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->stdn_load_shortcodes();
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/stadniva-core-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/stadniva-core-public.js', array( 'jquery' ), $this->version, false );

		/**
		 * Get post meta information for localization
		 */
		$price_ranges = '';
		$meta_data    = $this->stdn_get_post_meta_data();
		if( isset ( $meta_data['stdn-price-repeater'] ) ):
			if ( is_array( $meta_data['stdn-price-repeater'] ) && ! empty( $meta_data['stdn-price-repeater'] ) ) {
				$price_ranges = wp_json_encode( $meta_data['stdn-price-repeater'], true );
			}
		endif;
		$urls = array(
			'siteUrl'     => site_url(),
			'pluginDir'   => plugin_dir_url( __FILE__ ),
			'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
			'nonce'       => wp_create_nonce( 'stdn_nonce' ),
			'priceRanges' => $price_ranges,
		);

		wp_localize_script( $this->plugin_name, 'stdn_data', $urls );
	}

	/**
	 * Debugging method.
	 *
	 * @param mixed $data The data to preprocess.
	 * @return void
	 */
	public function pre( $data ) {
		echo '<pre>';
		print_r( $data );
	}

	/**
	 * Method to get post meta data
	 */
	private function stdn_get_post_meta_data() {
		if ( isset( $_GET['serviceid'] ) && isset( $_GET['servicename'] ) && isset( $_GET['nonce'] ) ) {
			/**
			 * Verify nonce
			 */
			if ( isset( $_GET['nonce'] ) || wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['nonce'] ) ), 'stdn_nonce' ) ) {
				$meta_data = get_post_meta( sanitize_text_field( wp_unslash( $_GET['serviceid'] ) ), 'stadniva-core', true );
				return $meta_data;
			}
		}
	}

	/**
	 * Method to add the shortcode
	 *
	 * @return void
	 */
	public function stdn_load_shortcodes() {
		/**
		 * Shortcode for pre booking service
		 */
		add_shortcode( 'stdn-pre-booking-service', array( $this, 'stdn_pre_booking_services_shortcode_callback' ) );

		/**
		 * Shortcode for booking service
		 */
		add_shortcode( 'stdn-book-service', array( $this, 'stdn_book_service_shortcode_callback' ) );

		/**
		 * Shortcode for the elementor popup
		 */
		add_shortcode( 'stdn-popup-content', array( $this, 'stdn_popup_content_shortcode_callback' ) );
	}

	/**
	 * Callback method for the booking service form
	 */
	public function stdn_pre_booking_services_shortcode_callback() {
		?>
<div class="stdn-postal-code-wrapper">
    <div class="stdn-postal-code-entry">
        <input id="postal-code" type="number" class="stdn-postal-code"
            placeholder="<?php esc_html_e( 'Ange ditt postnummer', 'stadniva-core' ); ?>" />
        <div class="stdn-postal-code-success">

        </div>
    </div>
    <div class="stdn-postal-code-result" style="display: none">

    </div>

    <div class="stdn-service-btn">
        <input disabled type="button" class="stdn-btn btn std-choose-service"
            value="<?php esc_html_e( 'VÄLJ TJÄNST', 'stadniva-core' ); ?>">
    </div>
</div>
<?php
	}

	/**
	 * Method to ask service questions and proceed with booking
	 */
	public function stdn_book_service_shortcode_callback() {
		if ( isset( $_GET['serviceid'] ) && isset( $_GET['servicename'] ) && isset( $_GET['nonce'] ) ) {
			/**
			 * Verify nonce
			 */
			if ( isset( $_GET['nonce'] ) || wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['nonce'] ) ), 'stdn_nonce' ) ) {

				ob_start();

				$meta_data    = get_post_meta( sanitize_text_field( wp_unslash( $_GET['serviceid'] ) ), 'stadniva-core', true );
				$service_name = sanitize_text_field( wp_unslash( $_GET['servicename'] ) );
				if ( is_array( $meta_data ) && ! empty( $meta_data ) ) {
					include plugin_dir_path( __FILE__ ) . 'partials/stadniva-core-public-display.php';
				}

				$content = ob_get_clean();
				return $content;
			}
		}
	}

	/**
	 * Method to show content for popup
	 */
	public function stdn_popup_content_shortcode_callback() {
		ob_start();

		$args = array(
			'post_type'      => 'stdn-services',
			'posts_per_page' => -1,
		);

		$services_data  = array();
		$services_query = new WP_Query( $args );

		?>
<!-- Modal -->
<div class="stdn-modal-wrapper">
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title"><?php esc_html_e( 'Välj tjänst', 'stadniva-core' ); ?></h4>
        </div>
        <div class="stadniva-modal-body modal-body">
            <p>
                <?php echo esc_html('Där du bor i '); ?>
                <span class="stdn-city-name"><strong><?php echo esc_html(isset($_SESSION['sweden_city']) ? sanitize_text_field($_SESSION['sweden_city']) : ''); ?></strong></span><?php echo esc_html(', erbjuder Städnivå följande tjänster'); ?>
            </p>

            <select name="selected_service" id="selected_service">
                <?php
							if ( $services_query->have_posts() ) :
								while ( $services_query->have_posts() ) :
									$services_query->the_post();
									$meta_data = get_post_meta( get_the_ID(), 'stadniva-core', true );
									if ( is_array( $meta_data ) ) {
										echo '<option data-moving-service="' . esc_attr( $meta_data['stdn-moving-service'] ? $meta_data['stdn-moving-service'] : 0 ) . '" value="' . esc_attr( get_the_ID() ) . '">' . esc_html( get_the_title() ) . '</option>';
									}
								endwhile;
								wp_reset_postdata();
							else :
								esc_html_e( 'No services found.', 'stadniva-core' );
							endif;
							?>
            </select>
        </div>
        <div class="stdn-inline-cf7"></div>
        <div class="modal-footer"></div>
    </div>
</div>
<?php
	}


	/**
	 * Method to check postal code
	 */
	public function stdn_check_postal_code_handler() {
		if ( isset( $_POST['action'] ) && 'stdn_check_postal_code' === $_POST['action'] && isset( $_POST['postalCode'] ) && isset( $_POST['nonce'] ) ) {
			/**
			 * Verify nonce
			 */
			if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'stdn_nonce' ) ) {
				/**
				 * Nonce verification failed
				 */
				$arr = array(
					'message' => esc_html__( 'Nonce verification failed.', 'stadniva-core' ),
				);

				wp_send_json_error( $arr );
			}

			/**
			 * Load JSON file contents
			 */
			$json_file = plugin_dir_url( __FILE__ ) . 'swedenpostalcodes.json';
			$response  = wp_remote_get( $json_file );

			/**
			 * Check if wp_remote_get was successful
			 */
			if ( is_wp_error( $response ) ) {
				$error_message = $response->get_error_message();
				$arr           = array(
					// translators: %s is the error message.
					'message' => sprintf( esc_html__( 'Failed to retrieve JSON data: %s', 'stadniva-core' ), $error_message ),
				);
				wp_send_json_error( $arr );
			}

			/**
			 * Retrieve data from JSON file to check zipcode
			 */
			$json_data    = wp_remote_retrieve_body( $response );
			$postal_codes = json_decode( $json_data, true );

			/**
			 * Sanitize and validate submitted postal code
			 */
			$submitted_postal_code = sanitize_text_field( wp_unslash( $_POST['postalCode'] ) );

			/**
			 * Check if submitted postal code exists in the JSON data
			 */
			$postal_code_found = false;
			foreach ( $postal_codes as $code ) {
				if ( isset( $code['Zip'] ) && $code['Zip'] === (int) $submitted_postal_code ) {
					$postal_code_found = true;
					$city              = $code['City'];
					$code              = $code['Zip'];
					break;
				}
			}

			$_SESSION['sweden_city'] = $city;

			if ( $postal_code_found ) {

				/**
				 * Postal code found in the JSON data
				 */
				$response = array(
					'message' => esc_html__( 'Postal code is valid.', 'stadniva-core' ),
					'img'     => plugin_dir_url( __FILE__ ) . 'images/tick.png',
					'code'    => $code,
					'city'    => $city,
					'status'  => 'success',
				);

				wp_send_json_success( $response );

			} else {

				/**
				 * Postal code not found in the JSON data
				 */
				$response = array(
					'message' => esc_html__( 'Tyvärr är ingen av våra tjänster tillgänglig i området.', 'stadniva-core' ),
					'status'  => 'error',
				);
				wp_send_json_error( $response );

			}
		}
	}

	/**
	 * Method to prepare cost estimation of service
	 */
	public function stdn_service_cost_estimation_handler() {
		if ( isset( $_POST['action'] ) && 'stdn_service_cost_estimation' === $_POST['action'] && isset( $_POST['livingSpace'] ) && isset( $_POST['nonce'] ) && isset( $_POST['serviceId'] ) ) {
			/**
			 * Verify nonce
			 */
			if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'stdn_nonce' ) ) {
				/**
				 * Nonce verification failed
				 */
				$arr = array(
					'message' => esc_html__( 'Nonce verification failed.', 'stadniva-core' ),
				);

				wp_send_json_error( $arr );
			}

			if ( ! is_numeric( (int) $_POST['livingSpace'] ) ) {
				$arr = array(
					'message' => esc_html__( 'Ange ett giltigt värde.', 'stadniva-core' ),
				);

				wp_send_json_error( $arr );
			}

			if ( empty( $_POST['serviceId'] ) ) {
				$arr = array(
					'message' => esc_html__( 'Service-ID är obligatoriskt.', 'stadniva-core' ),
				);

				wp_send_json_error( $arr );
			}

			$living_space = (int) sanitize_text_field( wp_unslash( $_POST['livingSpace'] ) );
			$service_id   = sanitize_text_field( wp_unslash( $_POST['serviceId'] ) );

			/**
			 * Get service information
			 */
			$post_meta_data = get_post_meta( $service_id, 'stadniva-core', true );
			if ( is_array( $post_meta_data ) && ! empty( $post_meta_data ) ) {

				/**
				 * Get service prices
				 */
				if ( ! empty( $post_meta_data['stdn-service-price'] ) ) {
					$service_fee = (int) $post_meta_data['stdn-service-price'] * $living_space;
					// $total    = $service_fee + (int) $post_meta_data['stdn-one-time-booking-price'];
					$total       = $service_fee;

					$arr = array(
						'service_fee' => $service_fee,
						'total'       => $total,
					);

					wp_send_json_success( $arr );
				} else {
					$arr = array(
						'message' => esc_html__( 'Något gick fel.', 'stadniva-core' ),
					);

					wp_send_json_error( $arr );
				}
			} else {
				$arr = array(
					'message' => esc_html__( 'Något gick fel.', 'stadniva-core' ),
				);

				wp_send_json_error( $arr );
			}
		}
	}

	/**
	 * AJAX: Return CF7 form HTML for a service id
	 */
	public function stdn_get_cf7_form_handler() {
		if ( ! isset( $_POST['serviceId'] ) || ! isset( $_POST['nonce'] ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Ogiltig förfrågan.', 'stadniva-core' ) ) );
		}

		if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'stdn_nonce' ) ) {
			wp_send_json_error( array( 'message' => esc_html__( 'Nonce verification failed.', 'stadniva-core' ) ) );
		}

		$service_id = sanitize_text_field( wp_unslash( $_POST['serviceId'] ) );
		$meta_data  = get_post_meta( $service_id, 'stadniva-core', true );
		if ( is_array( $meta_data ) && ! empty( $meta_data['stdn-cf7-shortcode'] ) ) {
			$form_html = do_shortcode( $meta_data['stdn-cf7-shortcode'] );
			wp_send_json_success( array( 'html' => $form_html ) );
		}

		wp_send_json_error( array( 'message' => esc_html__( 'Formulär hittades inte.', 'stadniva-core' ) ) );
	}
}