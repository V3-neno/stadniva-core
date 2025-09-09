<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://designingmedia.com/
 * @since      1.0.0
 *
 * @package    Stadniva_Core
 * @subpackage Stadniva_Core/public/partials
 */

?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="stdn-booking-form-wrapper">
	<div class="stdn-booking-data-wrapper">
		<div class="stdn-booking-data">

			<div class="stdn-service-info-wrapper">
				<?php
				if ( ! empty( $meta_data['stdn-service-main-info'] ) ) {
					?>

				<?php
						if ( ! empty( $meta_data['stdn-service-info-icon'] ) ) {
					?>
				<div class="stdn-service-icon">
					<img src="<?php echo esc_html( $meta_data['stdn-service-info-icon'] ); ?>" class="stdn-icon"
						alt="<?php esc_html_e( 'Service Icon', 'stadniva-core' ); ?>">
				</div>
				<?php
						}
					?>
				<div class="stdn-service-info">
					<p> <?php echo esc_html( $meta_data['stdn-service-main-info'] ); ?>
						<?php // echo ! empty( $meta_data['stdn-service-tooltip-info'] ) ? '<a href="#" class="stdn-service-extra-info"> här. </a>' : ''; ?>
					</p>
				</div>
				<?php
				}
				?>
			</div>

			<!-- The Modal -->
			<div id="extraInfoModal" class="modal" style="display: none;">
				<div class="modal-content">
					<span class="close">&times;</span>
					<p><?php echo wp_kses_post( $meta_data['stdn-service-tooltip-info'] ); ?></p>
				</div>
			</div>

			<?php
			if ( 'Hemstädning' === $service_name || 'Flyttstädning' === $service_name || 'Storstädning' === $service_name ) :
				?>

			<?php
			if ( 'Hemstädning' !== $service_name):
			?>
			<div class="stdn-service-name">
				<label class="stdn-question-title"><?php esc_html_e( 'Bostadsyta (kvm)*', 'stadniva-core' ); ?></label>
			</div>
			<div class="form-group stdn-input-text">
				<input type="number" class="form-control stdn_living_space" required name="living_space">
			</div>
			<?php
			endif;
			if ( 'Hemstädning' === $service_name):
			?>
			<div class="stdn-service-name">
				<label
					class="stdn-question-title"><?php esc_html_e( 'Frekvens per timme*', 'stadniva-core' ); ?></label>
			</div>
			<select class="form-control" name="per_hour_cleaning" required id="per_hour_cleaning">
				<!-- <option value="">Välj alternativ</option> -->
				<?php
				foreach ($meta_data['stdn-option-repeater'] as $item) {
					echo '<option value="'.$item["stdn-drpdn-option"].'">'.$item["stdn-drpdn-option"].'</option>';
				}
				?>
			</select>
			<?php
			endif;
			?>
			<?php elseif ( 'Fönsterputs' === $service_name ) : ?>
			<form id="cleaning-form">

				<div class="stdn-service-name">
					<label class="stdn-question-title"><?php esc_html_e( 'ROK*', 'stadniva-core' ); ?></label>
				</div>
				<div class="form-group">
					<select class="form-control" name="rok" required id="rok">
						<!-- <option value="">Välj alternativ</option> -->
						<?php
				foreach ($meta_data['stdn-rok-repeater'] as $item) {
					echo '<option value="'.$item["stdn-rok-price"].'">'.$item["stdn-rok"].'</option>';
				}
				?>
					</select>
				</div>
				<div class="form-group">
					<?php
					foreach ($meta_data['stdn-checkbox-repeater'] as $item) {
					?>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="rokcheckbox"
								id="<?php echo $item['stdn-checkbox-option'];?>"
								value="<?php echo $item['stdn-checkbox-option'];?>">
							<label
								for="<?php echo $item['stdn-checkbox-option'];?>"><?php echo $item['stdn-checkbox-option'];?></label>
						</div>
					<?php
					}
						?>
				</div>
			</form>
			<?php else : ?>
			<!-- Handle other cases or display a default message -->
			<?php endif; ?>

			<?php
			if ( is_array( $meta_data['stdn-additional-info-repeater'] ) && ! empty( $meta_data['stdn-additional-info-repeater'] ) ) {
				$service_questions_list = $meta_data['stdn-additional-info-repeater'];
				foreach ( $service_questions_list as $key => $service_question ) {
					if ( 'text' === $service_question['stdn-service-question-type'] || 'number' === $service_question['stdn-service-question-type'] ) :
						?>
			<label class="stdn-question-title">
				<?php
										echo esc_html( $service_question['stdn-service-question'] );
										echo '1' === $service_question['stdn-question-required'] ? '<span style="color: red;">*</span>' : '';
									?>
			</label>
			<div
				class="form-group stdn-input-text <?php echo true == $service_question['stdn-previous-child'] ? 'stdn-child-of-above' : ''; ?>">

				<input <?php echo '1' === $service_question['stdn-question-required'] ? 'required' : ''; ?>
					type="<?php echo esc_attr( $service_question['stdn-service-question-type'] ); ?>"
					class="form-control"
					name="<?php echo esc_attr( str_replace( ' ', '_', strtolower( $service_question['stdn-service-question'] ) ) ); ?>" />
			</div>
			<?php
					elseif ( 'radio' === $service_question['stdn-service-question-type'] ) :

						?>
			<label class="stdn-question-title">
				<?php
										echo esc_html( $service_question['stdn-service-question'] );
										echo '1' === $service_question['stdn-question-required'] ? '<span style="color: red;">*</span>' : '';
									?>
			</label>
			<div
				class="form-group <?php echo true == $service_question['stdn-previous-child'] ? 'stdn-child-of-above' : ''; ?>">

				<?php
								if ( is_array( $service_question['stdn-service-question-options'] ) ) :
									foreach ( $service_question['stdn-service-question-options'] as $key => $option ) :
										?>
				<div class="form-check">
					<input
						data-service-price='<?php echo esc_attr( ! empty( $option['stdn-service-price'] ) ? $option['stdn-service-price'] : '' ); ?>'
						<?php echo ( 0 == $key && '1' === $service_question['stdn-question-required'] ) ? 'required' : ''; ?>
						<?php echo ( 0 == $key ) ? 'checked' : ''; ?> class="form-check-input service-radios"
						type="radio"
						name="<?php echo esc_attr( str_replace( ' ', '_', strtolower( $service_question['stdn-service-question'] ) ) ); ?>"
						value="<?php echo esc_attr( $option['stdn-service-option-value'] ); ?>" />
					<label class="form-check-label">
						<?php echo esc_html( $option['stdn-service-option-value'] ); ?>
					</label>
				</div>
				<?php
									endforeach;
								endif;
								?>
			</div>
			<?php
					elseif ( 'checkbox' === $service_question['stdn-service-question-type'] ) :
						?>
			<label class="stdn-question-title">
				<?php
										echo esc_html( $service_question['stdn-service-question'] );
										echo '1' === $service_question['stdn-question-required'] ? '<span style="color: red;">*</span>' : '';
									?>
			</label>
			<div
				class="form-group <?php echo true == $service_question['stdn-previous-child'] ? 'stdn-child-of-above' : ''; ?>">

				<?php
								if ( is_array( $service_question['stdn-service-question-options'] ) ) :
									foreach ( $service_question['stdn-service-question-options'] as $key => $option ) :
										?>
				<div class="form-check">
					<input
						data-service-price='<?php echo esc_attr( ! empty( $option['stdn-service-price'] ) ? $option['stdn-service-price'] : '' ); ?>'
						<?php echo ( 0 == $key && '1' === $service_question['stdn-question-required'] ) ? 'required' : ''; ?>
						class="form-check-input" type="checkbox"
						name="<?php echo esc_html( str_replace( ' ', '_', strtolower( $service_question['stdn-service-question'] ) ) ); ?>[]"
						value="<?php echo esc_attr( $option['stdn-service-option-value'] ); ?>" />
					<label class="form-check-label">
						<?php echo esc_html( $option['stdn-service-option-value'] ); ?>
					</label>
				</div>
				<?php
									endforeach;
								endif;
								?>
			</div>
			<?php
					endif;
				}
			}

// 			if ( ! empty( $meta_data['stdn-service-price'] ) ) {
				?>
			<button type="button"
				class="btn btn-secondary stdn-cont-booking"><?php esc_html_e( 'FORTSÄTT', 'stadniva-core' ); ?></button>
			<?php
// 			}

			?>
		</div>

		<?php
		if ( true == $meta_data['stdn-moving-service'] ) {
			?>
		<div class="move-to move_to_form">
		</div>
		<?php
		}
		?>
	</div>


	<div class="stadn-booking-parent">
		<div class="stdn-booking-cost-wrapper">
			<div class="stdn-estimation-heading">

				<div class="stdn-data stdn-service-details">
					<!-- <label><?php // esc_html_e( 'Städningsavgift', 'stadniva-core' ); ?></label> -->
					<?php if ( is_array( $meta_data ) && ! empty( $meta_data ) ) : ?>
					<span style="display:none"
						class="stdn-service-cost"><?php echo esc_html( $meta_data['stdn-service-price'] ?? '' ); ?></span>
					<input type="hidden" class="stdn-service-price"
						value="<?php echo esc_attr( $meta_data['stdn-service-price'] ?? '' ); ?>">
					<?php endif; ?>
				</div>

				<?php
				if ( 'Hemstädning' === $service_name ) :
					?>
				<h3><?php esc_html_e( 'Sammanställning', 'stadniva-core' ); ?></h3>
				<div class="stdn-estimation-info">

					<div class="stdn-cleaning-perhour">
						<h5><?php esc_html_e( 'Frekvens per timme', 'stadniva-core' ); ?></h5>
						<span
							class="stdn-selected-cleaning-perhour"><?php esc_html_e( ' Hemstädning Måndag – Onsdag 190:-/ Timmen ', 'stadniva-core' ); ?></span>
					</div>

					<div class="stdn-cleaning-freq">
						<h5><?php esc_html_e( 'Städfrekvens', 'stadniva-core' ); ?></h5>
						<span
							class="stdn-selected-cleaning-freq"><?php esc_html_e( ' Varannan vecka ', 'stadniva-core' ); ?></span>
					</div>

					<div class="stdn-service-consultation">
						<h5><?php esc_html_e( 'Konsultation', 'stadniva-core' ); ?></h5>
						<p><?php esc_html_e( 'Ring mig en bokad tid', 'stadniva-core' ); ?></p>
					</div>

					<div class="stdn-service-booking-date-time">
						<h5><?php esc_html_e( 'Datum och tid', 'stadniva-core' ); ?></h5>
						<p class="stdn-booking-date">-</p>
						<p class="stdn-booking-time">-</p>
					</div>

					<div class="stdn-data stdn-total-estimation">
						<label><?php esc_html_e( 'Totalt', 'stadniva-core' ); ?></label>
						<span
							class="stdn-service-price-info"><?php esc_html_e( 'med rutavdrag', 'stadniva-core' ); ?></span>
						<span style="display:none" class="stdn-total-est"> </span>
					</div>

					<div class="stdn-service-cart-info">
						<p><?php esc_html_e( '*Ditt pris baseras på den uppskattade tidsåtgången för våra grundläggande städmoment i ett genomsnittligt hem. Efter att stämt av ditt hems specifika förutsättningar och dina preferenser presenteras ditt slutgiltiga pris i ditt startsamtal.', 'stadniva-core' ); ?>
						</p>
					</div>
				</div>
				<?php elseif ( 'Fönsterputs' === $service_name ) : ?>
				<h3><?php esc_html_e( 'Din bokning', 'stadniva-core' ); ?></h3>

				<div class="stdn-cleaning-freq">
					<h5><?php esc_html_e( 'Fönsterputs', 'stadniva-core' ); ?></h5>
					<span class="stdn-service-fee">
						<?php
							if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
								echo esc_html( $meta_data['stdn-service-price'] );
							}
							?>
					</span>
				</div>

				<div class="stdn-window-cleaning-rok">
					<h5>ROK</h5>
					<span class="stdn-window-cleaning-rok-fee"><?php esc_html_e( ' 450 :- ', 'stadniva-core' ); ?></span>
				</div>

				<div class="stdn-window-cleaning-rokcheckbox">
					<!-- <h5>ROK</h5> -->
					<span
						class="stdn-window-cleaning-rokcheckbox-txt"><?php esc_html_e( ' - ', 'stadniva-core' ); ?></span>
				</div>

				<div class="stdn-service-booking-date-time">
					<h5><?php esc_html_e( 'Datum och tid', 'stadniva-core' ); ?></h5>
					<p class="stdn-booking-date">-</p>
					<p class="stdn-booking-time">-</p>
				</div>

				<div class="stdn-data stdn-total-estimation">
					<label><?php esc_html_e( 'Totalt', 'stadniva-core' ); ?></label>
					<span
						class="stdn-service-price-info"><?php esc_html_e( 'med rutavdrag', 'stadniva-core' ); ?></span>
					<span class="stdn-total-est"> 450 :-
						<?php
						// if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
						// 	echo esc_html( $meta_data['stdn-service-price'] );
						// }
						?>
					</span>
				</div>
				<?php elseif ( 'Storstädning' === $service_name ) : ?>
				<h4><?php esc_html_e( 'Din bokning', 'stadniva-core' ); ?></h4>

				<div style="display:none" class="stdn-cleaning-freq">
					<h5><?php esc_html_e( 'Storstädning', 'stadniva-core' ); ?></h5>
					<span style="display:none" class="stdn-service-fee">
						<?php
							if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
								echo esc_html( $meta_data['stdn-service-price'] );
							}
							?>
					</span>
				</div>

				<div style="display: none" class="stdn-städutrustning">
					<h5><?php esc_html_e( 'Städutrustning', 'stadniva-core' ); ?></h5>
					<span> </span>
				</div>

				<div style="display:none" class="stdn-cleaning-freq">
					<h5><?php esc_html_e( 'Serviceavgift engångsbokning', 'stadniva-core' ); ?></h5>
					<span class="stdn-service-onetime-fee">70</span>
				</div>

				<div style="display: none" class="stdn-fönsterputs">
					<h5><?php esc_html_e( 'Fönsterputs', 'stadniva-core' ); ?></5>
				</div>

				<div class="stdn-service-booking-date-time">
					<h5><?php esc_html_e( 'Datum och tid', 'stadniva-core' ); ?></h5>
					<p class="stdn-booking-date">-</p>
					<p class="stdn-booking-time">-</p>
				</div>

				<div class="stdn-data stdn-total-estimation">
					<label><?php esc_html_e( 'Totalt', 'stadniva-core' ); ?></label>
					<span
						class="stdn-service-price-info"><?php esc_html_e( 'med rutavdrag', 'stadniva-core' ); ?></span>
					<span style="display:none" class="stdn-total-est">
						<?php
							if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
								echo esc_html( $meta_data['stdn-service-price'] + 70 );
							}
							?>
					</span>
				</div>
				<?php elseif ( 'Flyttstädning' === $service_name ) : ?>
				<h3><?php esc_html_e( 'Din bokning', 'stadniva-core' ); ?></h3>

				<div style="display:none" class="stdn-cleaning-freq">
					<h5><?php esc_html_e( 'Flyttstädning', 'stadniva-core' ); ?></h5>
					<span style="display:none" class="stdn-service-fee">
						<?php
							if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
								echo esc_html( $meta_data['stdn-service-price'] );
							}
							?>
					</span>
				</div>

				<div style="display:none" class="stdn-cleaning-freq">
					<h5><?php esc_html_e( 'Serviceavgift engångsbokning', 'stadniva-core' ); ?></h5>
					<span class="stdn-service-onetime-fee">70</span>
				</div>

				<div class="stdn-service-booking-date-time">
					<h5><?php esc_html_e( 'Datum och tid', 'stadniva-core' ); ?></h5>
					<p class="stdn-booking-date">-</p>
					<p class="stdn-booking-time">-</p>
				</div>

				<div class="stdn-data stdn-total-estimation">
					<label><?php esc_html_e( 'Totalt', 'stadniva-core' ); ?></label>
					<span
						class="stdn-service-price-info"><?php esc_html_e( 'med rutavdrag', 'stadniva-core' ); ?></span>
					<span style="display:none" class="stdn-total-est">
						<?php
							if ( isset( $meta_data['stdn-service-price'] ) && ! empty( $meta_data['stdn-service-price'] ) ) {
								echo esc_html( $meta_data['stdn-service-price'] + 70 );
							}
							?>
					</span>
				</div>
				<?php elseif ( 'Flytthjälp' === $service_name ) : ?>
				<h5><?php esc_html_e( 'Din förfrågan', 'stadniva-core' ); ?></h5>

				<div class="stdn-moving-service-from">
					<h5 class="stdn-title"><?php esc_html_e( 'Flyttar från', 'stadniva-core' ); ?></h5>
					<span class="move-from-gatuadress"> </span>
					<span class="moving-from">
						<?php
							if ( isset( $_GET['moveto'] ) ) {
								echo esc_html( $_GET['moveto'] );
							}
							?>
						<span class="stdn-moving-kvm"> </span>
					</span>
				</div>
				<div class="stdn-moving-service-to">
					<h5 class="stdn-title"><?php esc_html_e( 'Flyttar till', 'stadniva-core' ); ?></h5>
					<span class="move-to-gatuadress"> </span>
					<span class="moving-to">
						<?php
							if ( isset( $_GET['moveto'] ) ) {
								echo esc_html( $_GET['moveto'] );
							}
							?>
						<span class="stdn-moving-to-kvm"> </span>
					</span>
				</div>

				<?php
					if ( true == $meta_data['stdn-moving-service'] ) {
						?>
				<div class="move-date">
					<div class="moving-date">
						<span class="moving-date-span"> </span>
					</div>

					<div class="moving-date-cleaning">
						<span class="moving-cleaning"> </span>
					</div>
				</div>
				<?php
					}
					?>
				<?php else : ?>
				<!-- Handle other cases or display a default message -->
				<?php endif; ?>
			</div>
		</div>
	</div>

</div>