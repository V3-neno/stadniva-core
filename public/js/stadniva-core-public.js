(function ($) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	document.addEventListener('DOMContentLoaded', (event) => {
		// Get the modal
		var modal = document.getElementById("extraInfoModal");

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

		// Get the extra info link
		var extraInfoLink = document.querySelector(".stdn-service-extra-info");

		// When the user clicks on the link, open the modal
		if (extraInfoLink) {
			extraInfoLink.addEventListener('click', function (event) {
				event.preventDefault(); // Prevent the default action
				modal.style.display = "block";
			});
		}

		// When the user clicks on <span> (x), close the modal
		span.onclick = function () {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	});

	$(document).ready(function () {
		$('label[for="rangetime1"]').text('Tidsluckor*:');
		stdnSearchPostalCode();
		additionalJsForSite();
		// stdnServiceFeeEstimation();
		stdnCheckMovingService();
		bookingForMovingService();
		openServiceDetailPageInNewTab();
		showChildServiceQuestion();
		serviceCounterFields();
		updateTimeSlots();


		//show elementor ppopup
		$('.std-choose-service').click(function () {
			elementorProFrontend.modules.popup.showPopup({ id: 5043 });
			$('.stdn-city-name').html(`<strong>${sessionStorage.getItem('cityName')}</strong>`);
		});

		//calculate totals
		$('.stdn_living_space').on('input', calculateTotalPrice);
		$('input[type="radio"]').on('change', calculateTotalPrice);
		$('select[name="select-kpt"], select[name="select-freq"]').on('change', calculateTotalPrice);
		$('input[name="number-kvm-f"]').on('input change', calculateTotalPrice);
		$('input[name="number-kvm-s"]').on('input change', calculateTotalPrice);
		$('select[name="select-ROK"], select[name="select-balkong"]').on('change', calculateTotalPrice);


		//moving service sidebar data
		if ($('.move-to').length >= 1) {
			// Attach event listeners to input fields
			$('.stdn-booking-data input, .move_to_form input').on('input change', function () {
				updateEstimationInfo();
			});

			// Initial update on page load
			updateEstimationInfo();

			$(document).on('click', '.wpbc_calendar', function () {
				let bookingDate = $('.datepick-current-day').find('.date-cell-content').find('a').text();
				if (bookingDate != '') {

					let header = $('.datepick-header');
					// Extract the month and year
					let month = header.find('span').eq(0).text().trim();
					let year = header.find('span').eq(1).text().trim();

					if (getQueryParam('servicename') === 'Flytthjälp') {

						// Parse the date string into a Date object
						let dateObj = new Date(bookingDate + ' ' + month + ' ' + year);
						var dayName;

						// Check if the date is valid
						if (!isNaN(dateObj.getTime())) {
							// Array of day names
							let dayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

							// Get the day of the week (0-6)
							let dayOfWeek = dateObj.getDay();

							// Get the day name
							dayName = dayNames[dayOfWeek];

							$('.move-date').show();
							$('.moving-date').html("<h4>Flyttdatum: </h4>" + dayName + ' ' + bookingDate + ' ' + month);
							$('.wpbc_calendar_wraper').hide();
							$('<p>*Observera att datumet bekräftas när du har godkänt din offert.</p>').insertAfter('.moving-date');

							// Create the back button
							var backButton = $('<input type="button" value="Back" class="stdn-back-calendar" />');

							// Insert the back button before the calendar wrapper
							backButton.insertBefore('.wpbc_calendar_wraper');

							$(document).on('click', '.stdn-back-calendar', function (e) {
								e.preventDefault();
								$('.datepick-current-day').click();
								$('.wpbc_calendar_wraper').show();
								$('.stdn-back-calendar').hide();
							});
						}
					} else {

						$('.move-date').show();
						$('.moving-date').html("<h4>Flyttdatum: </h4>" + bookingDate + ' ' + month + ' ' + year);
						$('.moving-cleaning').html("<h4>Flyttstädning: </h4>" + bookingDate + ' ' + month + ' ' + year);
						$('.wpbc_calendar_wraper').hide();

						// Create the back button
						var backButton = $('<input type="button" value="Back" class="stdn-back-calendar" />');

						// Insert the back button before the calendar wrapper
						backButton.insertBefore('.wpbc_calendar_wraper');

						$(document).on('click', '.stdn-back-calendar', function (e) {
							e.preventDefault();
							$('.datepick-current-day').click();
							$('.wpbc_calendar_wraper').show();
							$('.stdn-back-calendar').hide();
						});
					}
				}
			});
		}

	});

	function updateTimeSlots() {
		const timeMap = {
			'9:00 AM – 10:00 AM': '09:00 – 10:00',
			'10:00 AM – 11:00 AM': '10:00 – 11:00',
			'11:00 AM – 12:00 PM (Noon)': '11:00 – 12:00',
			'12:00 PM (Noon) – 1:00 PM': '12:00 – 13:00',
			'1:00 PM – 2:00 PM': '13:00 – 14:00',
			'2:00 PM – 3:00 PM': '14:00 – 15:00',
			'3:00 PM – 4:00 PM': '15:00 – 16:00',
			'4:00 PM – 5:00 PM': '16:00 – 17:00',
			'5:00 PM – 6:00 PM': '17:00 – 18:00',
			'6:00 PM – 7:00 PM': '18:00 – 19:00',
			'Full Day': '00:00 – 24:00'
		};

		$('.wpbc_times_selector div').each(function () {
			const currentText = $(this).text().trim();
			const newText = timeMap[currentText];
			if (newText) {
				$(this).text(newText);
			}
		});

		// Call the function again after 5 seconds
		setTimeout(updateTimeSlots, 1500);
	}

	//method to process counter for services
	function serviceCounterFields() {
		$(".increment").click(function () {
			let input = $(this).siblings(".quantity");
			let currentValue = parseInt(input.val());
			input.val(currentValue + 1);
			toggleAdditionalFields(input);
		});

		$(".decrement").click(function () {
			let input = $(this).siblings(".quantity");
			let currentValue = parseInt(input.val());
			if (currentValue > 0) {
				input.val(currentValue - 1);
				toggleAdditionalFields(input);
			}
		});
	}

	//method to toggle counter fields
	function toggleAdditionalFields(input) {
		let value = parseInt(input.val());
		let additionalFields = input.closest(".form-group").find(".additional-fields");
		if (value > 0) {
			additionalFields.show();
		} else {
			additionalFields.hide();
		}
	}

	//method to show and hide child question div
	function showChildServiceQuestion() {
		// Attach change event to all radio buttons in the .form-group
		$('.form-group').find('input[type="radio"]').on('change', function () {
			toggleChildOfAbove();
		});

		// Initial check on page load
		toggleChildOfAbove();
	}

	// Function to show or hide the next .stdn-child-of-above div based on the previous radio selection
	function toggleChildOfAbove() {
		$('.stdn-child-of-above').each(function () {
			var prevDiv = $(this).prev('.form-group');
			var selectedRadio = prevDiv.find('input[type="radio"]:checked').val();

			// Show the div only if 'Ja' is selected
			if (selectedRadio === 'Ja') {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	}

	//method to show moving service data in the sidebar
	function updateEstimationInfo() {
		var estimationInfo = '';

		// Extract data from "Move From" section
		estimationInfo += '<h4>Flytta från</h4>';  // Add a heading for "Move From"
		$('.stdn-booking-data .form-group').each(function () {
			var $group = $(this);
			var label = $group.find('.stdn-question-title').text().trim();
			var value = '';

			// Check if the group contains radio buttons
			if ($group.find('input[type=radio]').length) {
				$group.find('input[type=radio]:checked').each(function () {
					value = $(this).siblings('label').text().trim();
				});
			} else {
				var $input = $group.find('input');
				if ($input.val()) {
					value = $input.val();
				}
			}

			if (value) {
				estimationInfo += '<div><label>' + label + '</label><span>' + value + '</span></div>';
			}
		});

		// Extract data from "Move To" section
		estimationInfo += '<h4>Flytta till</h4>';  // Add a heading for "Move To"
		$('.move_to_form .form-group').each(function () {
			var $group = $(this);
			var label = $group.find('.stdn-question-title').text().trim();
			var value = '';

			// Check if the group contains radio buttons
			if ($group.find('input[type=radio]').length) {
				$group.find('input[type=radio]:checked').each(function () {
					value = $(this).siblings('label').text().trim();
				});
			} else {
				var $input = $group.find('input');
				if ($input.val()) {
					value = $input.val();
				}
			}

			if (value) {
				estimationInfo += '<div><label>' + label + '</label><span>' + value + '</span></div>';
			}
		});

		// Update the stdn-estimation-info div
		$('.stdn-estimation-info').html(estimationInfo);
	}

	// Function to get the price based on the range
	function getPriceForRange(range) {
		const priceRanges = JSON.parse(stdn_data.priceRanges);
		// Convert range string to integer if it's numeric
		const rangeValue = parseInt(range, 10);
		// Loop through the price ranges to find the matching price
		for (const item of priceRanges) {
			const rangeText = item['stdn-kvm-range'];
			if (rangeText.includes('+')) {
				// Handle the '99+' case
				const minRange = parseInt(rangeText, 10);
				if (rangeValue >= minRange) {
					return parseFloat(item['stdn-service-price']);
				}
			} else {
				// Handle the '0-19' style ranges
				const [minRange, maxRange] = rangeText.split('-').map(Number);
				if ((maxRange === undefined && rangeValue >= minRange) ||
					(minRange <= rangeValue && rangeValue <= maxRange)) {
					return parseFloat(item['stdn-service-price']);
				}
			}
		}
		// Default price if no range matches
		return 0;
	}

	//method to calculate prices
	function calculateTotalPrice() {

		var totalPrice = 0;
		var servicePrice = 0;
		let stdn_obj = $('.stdn_living_space');
		if(stdn_obj.length > 0){
			servicePrice = getPriceForRange($('.stdn_living_space').val());
		}
		// else{
		// 	const servicePrice = 0;
		// }
		
		// let servicePrice = $('.stdn-service-price').val();
		// servicePrice = servicePrice * $('.stdn_living_space').val();
		$('input[type="radio"]:checked').each(function () {
			// Get the service price from the data attribute
			var servicePrice = parseFloat($(this).data('service-price')) || 0;

			// Add the service price to the total price
			totalPrice += servicePrice;
		});

		// For Fönsterputs service total calculation (CF7-driven)
		if (getQueryParam('servicename') === 'Fönsterputs') {
			var rokMap = {
				'1 ROK': 500,
				'2 ROK': 650,
				'3 ROK': 750,
				'4 ROK': 900,
				'5 ROK': 1050,
				'VILLA': 1600
			};
			var balkongMap = {
				'INGEN BALKONG 0:-': 0,
				'GLAS RÄCKE 300:-': 300,
				'HALV INGLASAD BALKONG 350:-': 350,
				'INGLASAD BALKONG 600:-': 600
			};

			var rokVal = ($('select[name="select-ROK"]').val() || '').toString().trim();
			var balkongVal = ($('select[name="select-balkong"]').val() || '').toString().trim();

			var rokPrice = rokMap[rokVal] || 0;
			var balkongPrice = balkongMap[balkongVal] || 0;

			servicePrice = rokPrice; // show ROK as main fee row
			$('.stdn-window-cleaning-rok-fee').text(rokPrice + ' :- ');
			$('.stdn-window-cleaning-rokcheckbox-txt').text(balkongVal ? balkongVal : ' – ');

			totalPrice = rokPrice + balkongPrice;
			$('.stdn-total-est').text(totalPrice + ' :-');
			$('.stdn-total-est').show();
		}

		// Flyttstädning pricing from CF7 kvm field (number-kvm-f)
		if (getQueryParam('servicename') === 'Flyttstädning') {
			var kvmVal = parseInt(($('input[name="number-kvm-f"]').val() || '').toString(), 10);
			if (!isNaN(kvmVal)) {
				// Map kvm to price per provided ranges
				var priceTable = [
					{ min: 0, max: 19, price: 1550 },
					{ min: 20, max: 29, price: 1650 },
					{ min: 30, max: 39, price: 1750 },
					{ min: 40, max: 49, price: 1850 },
					{ min: 50, max: 59, price: 2050 },
					{ min: 60, max: 69, price: 2150 },
					{ min: 70, max: 79, price: 2250 },
					{ min: 80, max: 89, price: 2350 },
					{ min: 90, max: 99, price: 2650 },
					{ min: 100, max: 109, price: 2750 },
					{ min: 110, max: 119, price: 2850 },
					{ min: 120, max: 129, price: 2950 },
					{ min: 130, max: 139, price: 3050 },
					{ min: 140, max: 149, price: 3150 },
					{ min: 150, max: 159, price: 3250 }
				];
				var matched = priceTable.find(function (r) { return kvmVal >= r.min && kvmVal <= r.max; });
				if (matched) {
					servicePrice = matched.price;
					$('.stdn-service-fee').text(servicePrice);
					$('.stdn-service-fee').show();
					$('.stdn-cleaning-freq').show();
					$('.stdn-total-est').text((servicePrice + 70) + ' :-');
					$('.stdn-total-est').show();
					return; // early exit; rest of calc not needed
				}
			} else {
				// hide when invalid/empty
				$('.stdn-service-fee').hide();
				$('.stdn-total-est').hide();
			}
		}

		// Storstädning pricing from CF7 kvm field (number-kvm-s)
		if (getQueryParam('servicename') === 'Storstädning') {
			var kvmValS = parseInt(($('input[name="number-kvm-s"]').val() || '').toString(), 10);
			if (!isNaN(kvmValS)) {
				var priceTableS = [
					{ min: 0, max: 49, price: 2150 },
					{ min: 50, max: 59, price: 2250 },
					{ min: 60, max: 69, price: 2350 },
					{ min: 70, max: 79, price: 2450 },
					{ min: 80, max: 89, price: 2550 },
					{ min: 90, max: 99, price: 2750 },
					{ min: 100, max: 109, price: 2900 },
					{ min: 110, max: 119, price: 3050 },
					{ min: 120, max: 129, price: 3200 }
				];
				var matchedS = priceTableS.find(function (r) { return kvmValS >= r.min && kvmValS <= r.max; });
				if (matchedS) {
					servicePrice = matchedS.price;
					$('.stdn-service-fee').text(servicePrice);
					$('.stdn-service-fee').show();
					$('.stdn-cleaning-freq').show();
					$('.stdn-total-est').text((servicePrice + 70) + ' :-');
					$('.stdn-total-est').show();
					return;
				}
			} else {
				$('.stdn-service-fee').hide();
				$('.stdn-total-est').hide();
			}
		}

		// helper for Hemstädning frequency multiplier from CF7 select-freq
		function getSelectedFrequencyMultiplier() {
			var freq = ($('[name="select-freq"]').val() || '').toString().trim();
			if (freq === 'Varje vecka') return 4;
			if (freq === 'Varannan vecka') return 2;
			if (freq === 'Var tredje vecka') return 1;
			if (freq === 'Var fjärde vecka') return 1;
			return 1;
		}

		//home cleaning/ Hemstädning pricing
		if(getQueryParam('servicename') === 'Hemstädning'){
			//for onload page
			showPerHourRate()

			function showPerHourRate(){
				var perHourVal = ($('[name="select-kpt"]').val() || '').toString();
				var numericValue = perHourVal.match(/\d+/);
				if (numericValue) {
					var multiplier = getSelectedFrequencyMultiplier();
					$('.stdn-total-est').text(parseFloat(numericValue[0]) * multiplier + ' :-/ mån');
					$('.stdn-total-est').show();
					servicePrice = parseFloat(numericValue[0]);
				}
			}

			$(document).on('change', '[name="select-kpt"]', function(){
				showPerHourRate()
			});
		}

		$('.stdn-service-cost').text(servicePrice);
		if(getQueryParam('servicename') === 'Hemstädning'){
			var multiplier = getSelectedFrequencyMultiplier();
			$('.stdn-total-est').text(
				(servicePrice * multiplier) + ' :-/ mån'
			);
		} else {
			$('.stdn-total-est').text(
				servicePrice + totalPrice + ` :- ${getQueryParam('servicename') === 'Hemstädning' ? '/ mån' : ''}`
			);
		}

		$('.stdn-booking-fee').show();
		$('.stdn-total-est').show();
		// $('.stdn-service-cost').show();

		if (getQueryParam('servicename') === 'Flyttstädning' || getQueryParam('servicename') === 'Storstädning') {

			$('input[name="test[]"]').on('change', function () {
				let price = $(this).data('service-price');
				if ($(this).is(':checked')) {
					$('.stdn-städutrustning').show();
					$('.stdn-städutrustning span').text(price);

					servicePrice = parseInt(servicePrice + price);
					$('.stdn-total-est').text(servicePrice + 70 + ' :-');
				} else {
					$('.stdn-städutrustning').hide();
					servicePrice = parseInt(servicePrice - price);
					$('.stdn-total-est').text(servicePrice + 70 + ' :-');
				}
			});

			if (servicePrice == 0) {
				$('.stdn-cleaning-freq').hide();
				$('.stdn-total-est').hide();
			} else {
				$('.stdn-service-fee').show();
				$('.stdn-cleaning-freq').show();
			}
			$('.stdn-service-fee').text(servicePrice);
			$('.stdn-total-est').text(servicePrice + 70 + ' :-');

			if(parseFloat(stdn_obj.val()) > 3000){
				// Swal.fire({
				// 	title: "Oops!",
				// 	text: "För större projekt, kontakta oss för en mer exakt offert",
				// 	icon: "info"
				// });
				alert('För större projekt, kontakta oss för en mer exakt offert');
			}
		}

	}

	//method to open service details in new tab
	function openServiceDetailPageInNewTab() {
		// Inline render CF7 when service is selected (no redirects)
		$(document).on('change', '#selected_service', function () {
			let serviceId = $('#selected_service').val();
			let $selected = $('#selected_service').find('option:selected');
			let isMovingService = !!$selected.data('moving-service');

			// For moving services, require postal code first
			if (isMovingService && ($('.stdn-postal-code-wrapper').length < 2 || !($('.stdn-moving-service')[1] && $('.stdn-moving-service')[1].value))) {
				return; // wait for postal validation
			}

			$.ajax({
				type: 'POST',
				url: stdn_data.ajaxUrl,
				data: {
					action: 'stdn_get_cf7_form',
					serviceId: serviceId,
					nonce: stdn_data.nonce
				},
				success: function (response) {
					if (response && response.success) {
						$('.stdn-inline-cf7').html(response.data.html);
						stdnBindCf7ToSummary();
					}
				}
			});
		});
	}

	// Function to get query parameters
	function getQueryParam(name) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name);
	}

	//method to adjust fields for the moving service
	function bookingForMovingService() {
		if (getQueryParam('moveto')) {
			//hide sqm field from the frontend
			$('.stdn-booking-data').first().children().first().css('display', 'none');

			// Get the stdn-booking-data div
			const $bookingData = $('.stdn-booking-data').first();

			// Get the move-to div
			const $moveTo = $('.move-to');

			// Clone the fields from stdn-booking-data
			const moveToFields = $bookingData.clone();

			// Modify the names and IDs of the cloned elements
			moveToFields.find('input').each(function () {
				// For radio buttons and checkboxes, change the name to ensure uniqueness
				if (this.type === 'radio' || this.type === 'checkbox') {
					// Change name and id to include a unique identifier
					const newName = $(this).attr('name').replace(/[\?\(\)_]+/g, '_') + '_move_to';
					$(this).attr('name', newName);
					$(this).attr('id', newName);
					$(this).siblings('label').attr('for', newName);
				} else {
					// For other inputs, just change the name
					const newName = $(this).attr('name') + '_move_to';
					$(this).attr('name', newName);
				}
			});

			// Add a heading for move-to
			$moveTo.html('<h2>Flytta till</h2>'); // Clear the content and add the heading

			// Append the modified fields to move-to
			$moveTo.append(moveToFields.html());


			$('.stdn-cont-booking').first().css('display', 'none');
			// $('.stdn-booking-cost-wrapper').hide();
		}
	}

	//method to check for moving service and add additional fields to form
	function stdnCheckMovingService() {
		$(document).on('change', '#selected_service', function () {
			let selectedOption = $(this).find('option:selected');
			// let selectedValue = selectedOption.val();
			let movingService = selectedOption.data('moving-service');

			//if the service is moving service then show postal code fields in the popup
			if (movingService == true) {
				let content = `
					<div class="stdn-moving-service-wrapper stdn-postal-code-wrapper">
						<div class="stdn-moving-service">
							<div class="stdn-moving-service-heading">
								<p> Flyttar till </p>
							</div>
							<div class="stdn-postal-code-entry">
								<input id="postal-code" type="number" class="stdn-moving-service stdn-postal-code" placeholder="Ange ditt postnummer" />
								<div class="stdn-postal-code-success">

								</div>
							</div>
							<div class="stdn-postal-code-result" style="display: none">

							</div>
						</div>
					</div>
				`;

				$('.stdn-moving-service-wrapper').remove();
				$('.stadniva-modal-body').append(content);
			} else {
				$('.stdn-moving-service-wrapper').remove();
			}
		});
	}

	//method to send ajax request to check if the postal code is present
	function stdnSearchPostalCode() {
		$(document).on('input', '.stdn-postal-code', function (e) {
			e.preventDefault();

			var postalCodeBtn = $(this); // Store the reference to `this` element
			let postalCode = postalCodeBtn.val();

			if (postalCode.length === 5) { // Check if 5 digits are entered
				setTimeout(function () {
					$('#postal-code').attr('type', 'number');
					$('.stdn-moving-service').attr('type', 'number');

					if (!postalCodeBtn.hasClass('stdn-moving-service')) {
						sessionStorage.setItem('moveFrom', postalCode);
					}

					if (postalCode) {
						$.ajax({
							type: 'POST',
							url: stdn_data.ajaxUrl,
							data: {
								action: 'stdn_check_postal_code',
								postalCode: postalCode,
								nonce: stdn_data.nonce,
							},
							success: function (response) {
								$('.stdn-ajax-response').remove();
								$('.stdn-success-logo').remove();

								if (response.success === false) {
									$('.stdn-postal-code-result').append(`<span class="stdn-ajax-response"> ${response.data.message} </span>`);
									$('.stdn-postal-code-result').show();
								} else if (response.success === true) {
									if (!postalCodeBtn.hasClass('stdn-moving-service')) {
										sessionStorage.setItem('moveFromCity', response.data.city);
									}

									$('.stdn-postal-code-success').append('<img src="' + response.data.img + '" class="stdn-success-logo" />');
									$('.std-choose-service').prop("disabled", false);

									$('#postal-code').attr('type', 'text');
									$('.stdn-moving-service').attr('type', 'text');

									if ($('.stdn-postal-code-wrapper').length >= 2) {
										// Update the second input if more than one is present
										$('.stdn-moving-service').val(response.data.code + ' ' + response.data.city);
									} else {
										$('#postal-code').val(response.data.code + ' ' + response.data.city);
									}

									$('.stdn-postal-code-result').hide();
									sessionStorage.setItem('cityName', response.data.city);

									// Inline render CF7 form for moving service after validation
									let $selected = $('#selected_service').find('option:selected');
									let isMovingService = !!$selected.data('moving-service');
									if (isMovingService && $('.stdn-postal-code-wrapper').length >= 2 && $('.stdn-moving-service')[1] && $('.stdn-moving-service')[1].value != '') {
										let serviceId = $('#selected_service').val();
										$.ajax({
											type: 'POST',
											url: stdn_data.ajaxUrl,
											data: {
												action: 'stdn_get_cf7_form',
												serviceId: serviceId,
												nonce: stdn_data.nonce
											},
											success: function (response) {
												if (response && response.success) {
													$('.stdn-inline-cf7').html(response.data.html);
													stdnBindCf7ToSummary();
												}
											}
										});
									}
								}
							},
							error: function (error) {
								console.error('An error occurred:', error);
							}
						});
					}
				}, 250);
			} else {
				// Handle the case where the postal code is not yet 5 digits, if necessary
			}
		});
	}


	//method to calculate service fee estimation
	function stdnServiceFeeEstimation() {
		$(document).on('input', '.stdn_living_space', function (e) {
			e.preventDefault();
			let livingSpace = $(this).val();
			if (livingSpace) {
				$.ajax({
					type: 'POST',
					url: stdn_data.ajaxUrl,
					data: {
						action: 'stdn_service_cost_estimation',
						'livingSpace': livingSpace,
						'serviceId': getQueryParam('serviceid'),
						nonce: stdn_data.nonce,
					},
					success: function (response) {
						if (response.success === false && response) {
							alert(response.data.message);
						} else if (response.success === true && response) {
							$('.stdn-service-cost').text(response.data.service_fee);
							$('.stdn-total-est').text(response.data.total + ' :-');
							$('.stdn-booking-fee').show();
							$('.stdn-total-est').show();
							// $('.stdn-service-cost').show();
						}
					},
					error: function (error) {
						console.log(error);
					}
				});
			}
		});
	}

	// Function to format the object for better readability
	function formatObject(obj) {
		return Object.entries(obj)
			.map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
			.join('\n');
	}

	// Function to get values of all fields from a form group
	function getFormValues(selector) {
		const values = {};
		let allRequiredFilled = true;

		$(selector).find('.form-group').each(function () {
			const $group = $(this);
			const $inputs = $group.find('input, textarea, select');

			$inputs.each(function () {
				const $input = $(this);

				// Check if the input is required and not filled
				if ($input.prop('required') && !$input.val()) {
					allRequiredFilled = false;
					$input.addClass('required-error'); // Optional: add class for styling errors
				} else {
					$input.removeClass('required-error'); // Remove error class if filled
				}

				// Check if the input is a text input, textarea, or select
				if ($input.is(':text') || $input.is('[type="number"]') || $input.is('textarea') || $input.is('select')) {
					values[$input.attr('name')] = $input.val();
				}

				// Check if the input is a radio button
				if ($input.is(':radio')) {
					if ($input.is(':checked')) {
						values[$input.attr('name')] = $input.val();
					}
				}

				// Handle checkboxes
				if ($input.is(':checkbox')) {
					if ($input.is(':checked')) {
						// Initialize the array if it doesn't exist
						if (!values[$input.attr('name')]) {
							values[$input.attr('name')] = [];
						}
						// Add the checked value to the array
						values[$input.attr('name')].push($input.val());
					}
				}

				// Handle additional fields within each form-group
				$group.find('.additional-fields').each(function () {
					const $additionalFields = $(this);
					const $radioButtons = $additionalFields.find('input[type="radio"]');

					$radioButtons.each(function () {
						const $radio = $(this);

						if ($radio.is(':checked')) {
							values[$radio.attr('name')] = $radio.val();
						}
					});
				});
			});
		});

		if (!allRequiredFilled) {
			alert('Vänligen fyll i alla obligatoriska fält.');
			return null;
		}

		return values;
	}

	//method to manage content for home cleaning service
	function updateContentForHemstädningService() {
		$('[name="menu-0"]').change(function () {
			$('.stdn-booking-time').text($(this).val());
		});

		$(document).on('change', '[name="date-285"]', function () {
			if ($(this).val()) {
				$('.stdn-booking-date').text($(this).val());
			}
			return
			let bookingDate = $('.datepick-current-day').find('.date-cell-content').find('a').text();
			if (bookingDate != '') {

				// Select the datepick-header element
				let header = $('.datepick-header');

				// Extract the month and year
				let month = header.find('span').eq(0).text().trim();
				let year = header.find('span').eq(1).text().trim();


				// Parse the date string into a Date object
				let dateObj = new Date(bookingDate + ' ' + month + ' ' + year);
				var dayName;

				// Check if the date is valid
				if (!isNaN(dateObj.getTime())) {
					// Array of day names
					let dayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

					// Get the day of the week (0-6)
					let dayOfWeek = dateObj.getDay();

					// Get the day name
					dayName = dayNames[dayOfWeek];

				}

				$('.stdn-booking-date').text(dayName + ' ' + bookingDate + ' ' + month);
				$('.wpbc_calendar_wraper').hide();

				//show booking time
				$('.wpbc_times_selector div').click(function () {
					$('.stdn-booking-time').text($('.wpbc_time_selected').attr('data-value'));
				});

				// Create the back button
				var backButton = $('<input type="button" value="Back" class="stdn-back-calendar" />');

				// Insert the back button before the calendar wrapper
				backButton.insertBefore('.wpbc_calendar_wraper');

				$(document).on('click', '.stdn-back-calendar', function (e) {
					e.preventDefault();
					$('.datepick-current-day').click();
					$('.wpbc_calendar_wraper').show();
					$('.stdn-back-calendar').hide();
				});
			}
		});
	}

	function addFewMoreFieldsForFlytthjalpService() {
		let content = `
			<div class="stdn-moving-explaination">
				<span>Beskriv din flytt</span>
				<div class="fivOuHY"><span class="moving-desc-tooltip"><img src="http://stadniva.roi.se/wp-content/uploads/2024/07/info.3739a985.svg"></span></div>
				<p>Här beskriver du kort din flytt, med fokus på sånt som kan påverka tidsåtgången. Du kan även ange om du vill ha hjälp med magasinering.</p>
				<input type="text" name="stdn-moving-desc" />
			</div>

			<div class="stdn-flytthjalp-more">
				<div class="stdn-packing-wrapper">
					<div class="form-group">
						<label class="stdn-question-title">Vill du ha hjälp med packning?*</label>
						<div class="fivOuHY"><span class="moving-packing-tooltip"><img src="http://stadniva.roi.se/wp-content/uploads/2024/07/info.3739a985.svg"></span></div>
						<div class="form-check">
							<input data-service-price="" checked="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp" value="Hela hemmet" id="Vill_du_ha_hjälp">
								<label class="form-check-label" for="Vill_du_ha_hjälp">Hela hemmet</label>
						</div>

						<div class="form-check">
							<input data-service-price="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp" value="Endast köket" id="Vill_du_ha_hjälp">
								<label class="form-check-label" for="Vill_du_ha_hjälp">Endast köket</label>
						</div>

						<div class="form-check">
							<input data-service-price="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp" value="Jag packar själv" id="Vill_du_ha_hjälp">
								<label class="form-check-label" for="Vill_du_ha_hjälp">Jag packar själv</label>
						</div>
					</div>
				</div>
				

				<div class="stdn-hantverk-wrapper">
					<div class="form-group">
						<label class="stdn-question-title">Vill du ha hjälp med enklare typer av hantverk?*</label>
						<div class="fivOuHY"><span class="moving-hjälp-tooltip"><img src="http://stadniva.roi.se/wp-content/uploads/2024/07/info.3739a985.svg"></span></div>
						<div class="form-check">
							<input data-service-price="" checked="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp_med_enklare" value="Ja tack, jag vill veta mer" id="Vill_du_ha_hjälp_med_enklare">
								<label class="form-check-label" for="Vill_du_ha_hjälp_med_enklare">Ja tack, jag vill veta mer</label>
						</div>

						<div class="form-check">
							<input data-service-price="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp_med_enklare" value="Nej tack" id="Vill_du_ha_hjälp_med_enklare">
								<label class="form-check-label" for="Vill_du_ha_hjälp_med_enklare">Nej tack</label>
						</div>
					</div>
				</div>

				<div class="stdn-återvinning-wrapper">

					<div class="form-group">
						<label class="stdn-question-title">Vill du ha hjälp med återanvändning/återvinning?*</label>
						<div class="fivOuHY"><span class="moving-återanvändning-tooltip"><img src="http://stadniva.roi.se/wp-content/uploads/2024/07/info.3739a985.svg"></span></div>
						<div class="form-check">
							<input data-service-price="" checked="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp_med_återanvändning" value="Ja tack, jag vill veta mer" id="Vill_du_ha_hjälp_med_återanvändning">
								<label class="form-check-label" for="Vill_du_ha_hjälp_med_återanvändning">Ja tack, jag vill veta mer</label>
						</div>

						<div class="form-check">
							<input data-service-price="" class="form-check-input service-radios" type="radio" name="Vill_du_ha_hjälp_med_återanvändning" value="Nej tack" id="Vill_du_ha_hjälp_med_återanvändning">
								<label class="form-check-label" for="Vill_du_ha_hjälp_med_återanvändning">Nej tack</label>
						</div>
					</div>
				</div>
			</div>

			<div id="extraInfoModal2" class="modal" style="display: none;">
				<div class="modal-content">
					<span class="close">&times;</span>
					<div class="hmvt0s1 fceSH04"><h3>Beskriv din flytt</h3>
						<p>Här vill vi att du kort beskriver din flytt och särskilt saker som kan påverka tidsåtgången. Till exempel: </p>
						<ul>
						<li>Hur många personer som bor i hushållet </li>
						<li>Om endast delar av ditt bohag ska flyttas </li>
						<li>Stopp på flera adresser </li>
						<li>Om det finns någon tung eller otymplig möbel (marmormöbler, pianon, kassaskåp, vapenskåp) </li>
						<li>Om det är en lång bärsträcka mellan bostad och parkering </li>
						<li>Om du inte kan eller vill använda RUT-avdrag (t.ex. företag, dödsbo)</li>
						</ul>
						<p><strong>Till/från villa/radhus:</strong></p>
						<ul>
						<li>Potentiella utemöbler, grill, studsmatta eller liknande</li>
						</ul>
						<p><strong>Till/från lägenhet:</strong></p>
						<ul>
						<li>Parkeringsmöjligheter i närhet av porten </li>
						<li>Om du bor i ett gårdshus </li>
						<li>Potentiella vinds- och/eller källarförråd</li>
						</ul>
						<p><strong>Till/från förråd:</strong></p>
						<ul>
						<li>Hur mycket bohag som avses</li>
						</ul>
						<p><strong>Magasinering:</strong></p>
						<ul>
						<li>Ange om du vill ha hjälp med magasinering samt hur länge </li>
						<li>Uppskatta hur många kubrik som ska förvaras</li>
						</ul>
					</div>
				</div>
			</div>


			<div id="packing-tooltip" class="modal" style="display: none;">
				<div class="modal-content">
					<span class="close">&times;</span>
					<div class="hmvt0s1 fceSH04"><h3>Packning</h3>
						<p>När du bokar packning som tillägg till din flytt tar vi fullt ansvar för att dina saker är tryggt och säkert packade och står ansvariga om en eventuell skada uppstår på det packade under flytten.</p>
						<p><strong>I packning ingår</strong></p>
						<ul>
						<li>Allt material som behövs som flyttlådor, wellpapp, bubbelplast, silkespapper, tejp och liknande.</li>
						<li>Hemfrids etiketter med tydlig märkning inför transport och placering på den nya adressen.</li>
						<li>Specialutbildad personal som utför packningen korrekt och säkert.</li>
						</ul>
					</div>
				</div>
			</div>

			<div id="hjälp-tooltip" class="modal" style="display: none;">
				<div class="modal-content">
					<span class="close">&times;</span>
					<div class="hmvt0s1 fceSH04"><h3>Enklare hantverk</h3>
						<p>När du bokar hantverkshjälp som tillägg till din flytt kan vi hjälpa dig med att till exempel montera ner gardinstänger, möbler eller tv-fästen.</p>
						<p><strong>Tjänster som ingår i rutavdraget</strong></p>
						<ul>
						<li>Uppsättning av gardinskena och gardinstänger.</li>
						<li>Upp/ned montering av möbler.</li>
						<li>Uppsättning av krokar, hyllor, tavlor, TV-fäste.</li>
						<li>Flyttning, montering och demontering av möbler och lösöre.</li>
						<li>Uppsättning och nertagning av gardinstänger, lampor, hyllor och tv.</li>
						</ul>
					</div>
				</div>
			</div>

			<div id="återanvändning-tooltip" class="modal" style="display: none;">
				<div class="modal-content">
					<span class="close">&times;</span>
					<div class="hmvt0s1 fceSH04"><h3>Återanvändning och återvinning</h3>
						<p>Har du saker du inte vill ha med dig i flytten? Vi kan hjälpa dig med återanvändning och återvinning. I samband med din flytt hjälper vi dig att lämna in det du inte längre behöver till Myrorna. Det som inte längre kan användas kan vi hjälpa dig att återvinna. </p>
						<p>Du kan läsa mer om vårt samarbete med Myrorna <a target="_blank" rel="noopener noreferrer" href="/myrorna/ateranvandning">här</a>.</p>
						<p><strong>I tjänsten ingår</strong></p>
						<ul>
						<li>Upphämtning av det du vill skänka.</li>
						<li>Sortering och transport till Myrorna för återanvändning.</li>
						<li>Transport av övrigt till återvinningscentral.</li>
						</ul>
						<p>Denna tjänst är inte rutberättigad. </p>
						<p><em>Vi kan tyvärr inte hjälpa dig att återvinna farligt avfall som till exempel färgrester och kemikalier. Utgångna mediciner lämnas till ditt närmaste apotek.</em></p>
					</div>
				</div>
			</div>
		`;

		$(document).on('click', '.moving-packing-tooltip', function () {
			$("#packing-tooltip").css("display", "block");
		});

		$(".close").on("click", function () {
			$("#packing-tooltip").css("display", "none");
		});

		// When the user clicks anywhere outside of the modal, close it
		$(window).on("click", function (event) {
			if ($(event.target).is("#packing-tooltip")) {
				$("#packing-tooltip").css("display", "none");
			}
		});


		$(document).on('click', '.moving-hjälp-tooltip', function () {
			$("#hjälp-tooltip").css("display", "block");
		});

		$(".close").on("click", function () {
			$("#hjälp-tooltip").css("display", "none");
		});

		// When the user clicks anywhere outside of the modal, close it
		$(window).on("click", function (event) {
			if ($(event.target).is("#hjälp-tooltip")) {
				$("#hjälp-tooltip").css("display", "none");
			}
		});



		$(document).on('click', '.moving-återanvändning-tooltip', function () {
			$("#återanvändning-tooltip").css("display", "block");
		});

		$(".close").on("click", function () {
			$("#återanvändning-tooltip").css("display", "none");
		});

		// When the user clicks anywhere outside of the modal, close it
		$(window).on("click", function (event) {
			if ($(event.target).is("#återanvändning-tooltip")) {
				$("#återanvändning-tooltip").css("display", "none");
			}
		});

		$(content).insertAfter($('#finns_hiss__move_to').parent().parent());
	}

	//method to manage content for Storstädning service
	function manageContentForStorstädningService() {
		// 		let content = `
		// 			<form id="cleaning-form">
		// 				<div class="form-group">
		// 					<label>Ugnsrengöring</label>
		// 					<div class="counter">
		// 						<button type="button" class="decrement">-</button>
		// 						<input type="text" value="1" class="quantity" readonly>
		// 						<button type="button" class="increment">+</button>
		// 					</div>
		// 				</div>

		// 				<div class="form-group">
		// 					<label>Kylskåpsrengöring</label>
		// 					<div class="counter">
		// 						<button type="button" class="decrement">-</button>
		// 						<input type="text" value="0" class="quantity" readonly>
		// 						<button type="button" class="increment">+</button>
		// 					</div>
		// 				</div>
		// 			</form>
		// 		`;

		// 		$(content).insertAfter($('input[name="test[]"]').parent().parent().next());


		let content2 = `
			<form id="cleaning-form">
				<div class="form-group">
					<label>Utan spröjs</label>
					<div class="counter">
						<button type="button" class="decrement">-</button>
						<input type="text" value="1" class="quantity" readonly>
						<button type="button" class="increment">+</button>
					</div>
					<div class="additional-fields">
						<label>Hur många sidor ska putsas?*</label>
						<div>
							<div class="stdn-counter-input">
								<input type="radio" id="dubbelsidiga1" name="sides1" value="4" checked>
								<label for="dubbelsidiga1">Dubbelsidiga - 4 sidor</label>
							</div>
							<div class="stdn-counter-input">
								<input type="radio" id="enkelsidiga1" name="sides1" value="2">
								<label for="enkelsidiga1">Enkelsidiga - 2 sidor</label>
                            </div>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label>Med spröjs</label>
					<div class="counter">
						<button type="button" class="decrement">-</button>
						<input type="text" value="0" class="quantity" readonly>
						<button type="button" class="increment">+</button>
					</div>
					<div class="additional-fields" style="display: none;">
						<label>Hur många sidor ska putsas?*</label>
						<div>
							<input type="radio" id="dubbelsidiga2" name="sides2" value="4" checked>
							<label for="dubbelsidiga2">Dubbelsidiga - 4 sidor</label>
							<input type="radio" id="enkelsidiga2" name="sides2" value="2">
							<label for="enkelsidiga2">Enkelsidiga - 2 sidor</label>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label>Överhängda fönster</label>
					<div class="counter">
						<button type="button" class="decrement">-</button>
						<input type="text" value="0" class="quantity" readonly>
						<button type="button" class="increment">+</button>
					</div>
					<div class="additional-fields" style="display: none;">
						<label>Hur många sidor ska putsas?*</label>
						<div>
							<input type="radio" id="dubbelsidiga3" name="sides3" value="4" checked>
							<label for="dubbelsidiga3">Dubbelsidiga - 4 sidor</label>
							<input type="radio" id="enkelsidiga3" name="sides3" value="2">
							<label for="enkelsidiga3">Enkelsidiga - 2 sidor</label>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label>Inglasad balkong</label>
					<div class="counter">
						<button type="button" class="decrement">-</button>
						<input type="text" value="0" class="quantity" readonly>
						<button type="button" class="increment">+</button>
					</div>
					<div class="additional-fields" style="display: none;">
						<label>Vad är det för typ av balkong?*</label>
						<div>
							<input type="radio" id="helt-inglasad" name="balkong" value="helt-inglasad" checked>
							<label for="helt-inglasad">Helt inglasad</label>
							<input type="radio" id="endast-glasracke" name="balkong" value="endast-glasracke">
							<label for="endast-glasracke">Endast glasräcke</label>
						</div>
					</div>
				</div>
			</form>
		`;

		// $(content2).insertBefore($('input[name="vill_du_lägga_till_något_mer?[]"]').parent().parent());
	}

	//additional JS code for the site
	function additionalJsForSite() {

		//home cleaning/ Hemstädning pricing
		if(getQueryParam('servicename') === 'Hemstädning'){
			//for onload page
			showPerHourRate()

			function showPerHourRate(){
				var perHourVal = ($('[name="select-kpt"]').val() || '').toString();
				var numericValue = perHourVal.match(/\d+/);
				if (numericValue) {
					// Use CF7 frequency select instead of legacy radios
					var freq = ($('[name="select-freq"]').val() || '').toString().trim();
					var multiplier = (freq === 'Varje vecka') ? 4 : (freq === 'Varannan vecka') ? 2 : 1;
					let total = parseFloat(numericValue[0]) * multiplier;
					$('.stdn-total-est').text(total + ' :-/ mån');

					$('.stdn-total-est').show();
				}
			}

			$(document).on('change', '[name="select-kpt"]', function(){
				showPerHourRate()
			});
		}
		

		$('.stdn-question-title').each(function () {
			const textContent = $(this).text().trim();  // Get the trimmed text content
			if (textContent.includes('test')) {  // Check if it contains 'test'
				$(this).hide();  // Hide the element
			}
		});


		// Create a heading element
		var heading = $('<h4>', {
			class: 'stdn-booking-pre-heading',
			text: 'Önskad tid och dag'
		});

		// Create a <br> element
		var lineBreak = $('<br>');

		// Prepend the <br> and then the heading to the .stdn-booking-calander div
		$('.stdn-booking-calander').prepend(heading).prepend(lineBreak);


		setTimeout(function () {
			$('.wpbc__row .wpbc__field .wpbc_button_light').text('Skicka');
		}, 1000)

		if (getQueryParam('servicename') && getQueryParam('servicename') === 'Storstädning') {
			manageContentForStorstädningService();
		}

		$('input[name="test[]"]').parent().prev().hide();

		//moving service 'flytthjalp'
		if (getQueryParam('servicename') && getQueryParam('servicename').replace(/\s+/g, '') === 'Flytthjälp') {

			//moving from
			setTimeout(function () {
				$('<span>Flyttar från</span>').insertBefore($('input[name="gatuadress"]').parent());
				if (sessionStorage.getItem('moveFrom') && sessionStorage.getItem('moveFromCity')) {
					$('.moving-from').text(sessionStorage.getItem('moveFrom') + ' ' + sessionStorage.getItem('moveFromCity'));
				}
			}, 900)

			$(document).on('input', 'input[name="gatuadress"]', function (e) {
				$('.move-from-gatuadress').text($('input[name="gatuadress"]').val());
			});

			$(document).on('input', 'input[name="ange_kvadratmeterytan_(kvm)"]', function (e) {
				$('.stdn-moving-kvm').text(`(${$('input[name="ange_kvadratmeterytan_(kvm)"]').val()} kvm)`);
			});

			$(document).on('click', 'input[name="vilken_typ_av_boende_flyttar_du_från?"]', function () {
				if ($(this).val() === 'Lägenhet') {
					$('input[name="antal_våningar_(trappor)"]').parent().show();
					$('input[name="finns_hiss?"]').parent().parent().show();
				} else if ($(this).val() === 'Förråd') {
					$('input[name="antal_våningar_(trappor)"]').parent().hide();
					$('input[name="finns_hiss?"]').parent().parent().hide();
					$('input[name="ange_storlek_(kvm)_och_innehåll_för_potentiella_biutrymmen"]').parent().hide();
				} else if ($(this).val() === 'Villa/Radhus') {
					$('input[name="antal_våningar_(trappor)"]').parent().hide();
					$('input[name="finns_hiss?"]').parent().parent().hide();
					$('input[name="ange_storlek_(kvm)_och_innehåll_för_potentiella_biutrymmen"]').parent().show();
				} else {
					$('input[name="antal_våningar_(trappor)"]').parent().hide();
					$('input[name="finns_hiss?"]').parent().parent().hide();
				}
			});

			// $('input[name="ange_storlek_(kvm)_och_innehåll_för_potentiella_biutrymmen"]').parent().hide();
			$('input[name="antal_våningar_(trappor)"]').parent().hide();
			$('input[name="finns_hiss?"]').parent().parent().hide();




			//moving to
			$(document).on('input', 'input[name="gatuadress_move_to"]', function (e) {
				$('.move-to-gatuadress').text($('input[name="gatuadress_move_to"]').val());
			});

			$(document).on('input', 'input[name="ange_kvadratmeterytan_(kvm)_move_to"]', function (e) {
				$('.stdn-moving-to-kvm').text(`(${$('input[name="ange_kvadratmeterytan_(kvm)_move_to"]').val()} kvm)`);
			});

			$(document).on('click', 'input[name="vilken_typ_av_boende_flyttar_du_från__move_to"]', function () {
				if ($(this).val() === 'Lägenhet') {
					$('input[name="antal_våningar_(trappor)_move_to"]').parent().show();
					$('input[name="finns_hiss?_move_to"]').parent().parent().show();
				} else if ($(this).val() === 'Förråd') {
					$('input[name="antal_våningar_(trappor)_move_to"]').parent().hide();
					$('input[name="finns_hiss?_move_to"]').parent().parent().hide();
					$('input[name="ange_storlek_(kvm)_och_innehåll_för_potentiella_biutrymmen_move_to"]').parent().hide();
				} else if ($(this).val() === 'Villa/Radhus') {
					$('input[name="antal_våningar_(trappor)_move_to"]').parent().hide();
					$('input[name="finns_hiss?_move_to"]').parent().parent().hide();
					$('input[name="ange_storlek_(kvm)_och_innehåll_för_potentiella_biutrymmen_move_to"]').parent().show();
				} else {
					$('input[name="antal_våningar_(trappor)_move_to"]').parent().hide();
					$('input[name="finns_hiss?_move_to"]').parent().parent().hide();
				}
			});

			setTimeout(function () {
				addFewMoreFieldsForFlytthjalpService()

				$(document).on('click', '.moving-desc-tooltip', function () {
					$("#extraInfoModal2").css("display", "block");
				});

				$(".close").on("click", function () {
					$("#extraInfoModal2").css("display", "none");
				});

				// When the user clicks anywhere outside of the modal, close it
				$(window).on("click", function (event) {
					if ($(event.target).is("#extraInfoModal2")) {
						$("#extraInfoModal2").css("display", "none");
					}
				});
			}, 1000);


		}

		//Window cleaning service (legacy handlers removed; CF7-driven now)

		//cleaning freq (CF7 only)
		// sync sammanställning with CF7 select "select-freq"
		$(document).on('change', '[name="select-freq"]', function () {
			$('.stdn-selected-cleaning-freq').text($(this).val());
			calculateTotalPrice();
		});
		// initial sync from CF7 select on page load (if present)
		var initialFreq = $('[name="select-freq"]').val();
		if (initialFreq) {
			$('.stdn-selected-cleaning-freq').text(initialFreq);
		}
		// remove reliance on #per_hour_cleaning; use CF7 select-kpt instead
		$(document).on('change', '[name="select-kpt"]', function () {
			$('.stdn-selected-cleaning-perhour').text($(this).val());
			calculateTotalPrice();
		});

		// keep sammanställning per-hour in sync with CF7 select "select-kpt"
		$(document).on('change', '[name="select-kpt"]', function () {
			var selectedPerHour = $(this).val();
			$('.stdn-selected-cleaning-perhour').text(selectedPerHour);
		});

		// initial sync from CF7 select on page load (if present)
		var initialKpt = $('[name="select-kpt"]').val();
		if (initialKpt) {
			$('.stdn-selected-cleaning-perhour').text(initialKpt);
		}

		$('.stdn-booking-calander').appendTo('.stdn-booking-data-wrapper');
		$('.stdn-booking-calander').show();

		if (window.location.href.indexOf("booking") > -1 && window.location.href.indexOf("moveto") > -1) {
			// $('#content .page-header .entry-title').text('Flytthjälp');
			$('.elementor-element-e83d6f3 .elementor-widget-container .elementor-heading-title').text(getQueryParam('servicename'));
		} else if (window.location.href.indexOf("booking") > -1 && window.location.href.indexOf("serviceid") > -1) {
			$('.elementor-element-e83d6f3 .elementor-widget-container .elementor-heading-title').text(getQueryParam('servicename'));
		}

		$('#postal-code').on('input', function () {
			let value = $(this).val();

			// Remove any non-numeric characters
			value = value.replace(/\D/g, '');

			// Limit to 5 digits
			if (value.length > 5) {
				value = value.slice(0, 5);
			}

			$(this).val(value);
		});

		//show calander form
		$(document).on('click', '.stdn-cont-booking', function (e) {
			e.preventDefault();

			let serviceName = getQueryParam('servicename');
			if (serviceName === 'Hemstädning' || serviceName === 'Fönsterputs' || serviceName === 'Flyttstädning' || serviceName === 'Storstädning') {
				updateContentForHemstädningService();
			}

			//check if the service is moving service
			if (getQueryParam('moveto')) {

				// Get all the values from stdn-booking-data and move-to
				const stdnBookingDataValues = getFormValues('.stdn-booking-data');
				if (!stdnBookingDataValues) {
					return; // Exit if required fields are not filled
				}

				stdnBookingDataValues['postal_code'] = sessionStorage.getItem('moveFrom');

				const moveToValues = getFormValues('.move-to');
				if (!moveToValues) {
					return; // Exit if required fields are not filled
				}

				moveToValues['postal_code'] = getQueryParam('moveto');

				// Convert objects to JSON strings for readable format
				// const stdnBookingDataJson = JSON.stringify(stdnBookingDataValues, null, 2); // Pretty-print with 2 spaces
				// const moveToJson = JSON.stringify(moveToValues, null, 2);

				$('.stdn-flytthjalp-more').show();

				$('[name="booking-details"]').val(
					`**Moving from:**\n\n${formatObject(stdnBookingDataValues)}\n\n**Moving to:**\n\n${formatObject(moveToValues)}`
				);
				$('[name="booking-details"]').closest('.wpbc__row').hide();

				$('.stdn-booking-calander').show();
			} else {
				const stdnBookingDataValues = getFormValues('.stdn-booking-data');
				if ($('.stdn_living_space').val() != '') {
					$('.stdn-booking-calander').show();
					let cleaningFee = $('.stdn-service-cost').text();
					let oneTimeBookingFee = $('.stdn-booking-fee').text();
					let rok = $('#rok').val();
					let rok_val = '';
					if(rok !== '' && typeof rok !== 'undefined'){
						rok_val = 'ROK: '+rok+' ';
					}
					let rok_checkbox = $('input[name="rokcheckbox"]').val();
					let rok_checkbox_val = '';
					if(rok_checkbox !== '' && typeof rok_checkbox !== 'undefined'){
						rok_checkbox_val = ' ROK_Checkbox: '+rok_checkbox+' ';
					}
					let per_hour_cleaning = ($('[name="select-kpt"]').val() || '').toString();
					let per_hour_cleaning_val = '';
					if (per_hour_cleaning !== '' && typeof per_hour_cleaning !== 'undefined') {
						per_hour_cleaning_val = 'Frekvens per timme: '+per_hour_cleaning+' ';
					}
					let total = $('.stdn-total-est').text();
					$('[name="booking-details"]').val(
						`${rok_val}${rok_checkbox_val}${per_hour_cleaning_val}Cleaning Fee: ${cleaningFee} Total: ${total} **Questions details:**\n\n${formatObject(stdnBookingDataValues)}\n\n
					`);
					$('[name="booking-details"]').closest('.wpbc__row').hide();
				} else {
					alert('Vänligen lägg till ett värde för boendeyta.');
				}
			}
		});
	}

	//function to get the value of a specific query parameter
	function getQueryParam(param) {
		let urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param);
	}

	// Helper: populate CF7 with selected service info and bind summary updates
	function stdnBindCf7ToSummary() {
		const $cf7 = $('.stdn-inline-cf7');
		if ($cf7.length === 0) return;

		// Populate hidden fields and display field
		let serviceId = $('#selected_service').val();
		let serviceName = $('#selected_service').find('option:selected').text();
		$cf7.find('input[name="serviceid"]').val(serviceId);
		$cf7.find('input[name="servicename"]').val(serviceName);
		$cf7.find('input[name="servicename-display"]').val(serviceName);

		// Service-specific mappings
		// Hemstädning
		if (serviceName === 'Hemstädning') {
			$cf7.off('change.stdnbind', 'select[name="select-kpt"]').on('change.stdnbind', 'select[name="select-kpt"]', function () {
				$('.stdn-selected-cleaning-perhour').text($(this).val());
			});
			$cf7.off('change.stdnbind', 'select[name="select-freq"]').on('change.stdnbind', 'select[name="select-freq"]', function () {
				$('.stdn-selected-cleaning-freq').text($(this).val());
			});

			$cf7.off('change.stdnbind input.stdnbind', 'input[name="date-285"]')
            	.on('change.stdnbind input.stdnbind', 'input[name="date-285"]', function () {
                const val = $(this).val();
                if (val) {
                    $('.stdn-booking-date').text(val);
                }
            });

			$cf7.off('change.stdnbind', 'select[name="menu-0"]')
				.on('change.stdnbind', 'select[name="menu-0"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-time').text(val);
					}
				});

			// Initial sync for prefilled values
			const initialDate = $cf7.find('input[name="date-285"]').val();
			if (initialDate) {
				$('.stdn-booking-date').text(initialDate);
			}
			const initialTime = $cf7.find('select[name="menu-0"]').val();
			if (initialTime) {
				$('.stdn-booking-time').text(initialTime);
			}
		}

		// Fönsterputs
		if (serviceName === 'Fönsterputs') {
			$cf7.off('change.stdnbind', 'select[name="select-ROK"]').on('change.stdnbind', 'select[name="select-ROK"]', function () {
				$('.stdn-window-cleaning-rok-fee').text($(this).val());
			});
			$cf7.off('change.stdnbind', 'select[name="select-balkong"]').on('change.stdnbind', 'select[name="select-balkong"]', function () {
				$('.stdn-window-cleaning-rokcheckbox-txt').text($(this).val());
			});

			$cf7.off('change.stdnbind input.stdnbind', 'input[name="date-285"]')
            	.on('change.stdnbind input.stdnbind', 'input[name="date-285"]', function () {
                const val = $(this).val();
                if (val) {
                    $('.stdn-booking-date').text(val);
                }
            });

			$cf7.off('change.stdnbind', 'select[name="menu-0"]')
				.on('change.stdnbind', 'select[name="menu-0"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-time').text(val);
					}
				});

			// Initial sync for prefilled values
			const initialDate = $cf7.find('input[name="date-285"]').val();
			if (initialDate) {
				$('.stdn-booking-date').text(initialDate);
			}
			const initialTime = $cf7.find('select[name="menu-0"]').val();
			if (initialTime) {
				$('.stdn-booking-time').text(initialTime);
			}
		}


		// Storstädning
		if (serviceName === 'Storstädning') {
			$cf7.off('change.stdnbind input.stdnbind', 'input[name="date-285"]')
				.on('change.stdnbind input.stdnbind', 'input[name="date-285"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-date').text(val);
					}
				});

			$cf7.off('change.stdnbind', 'select[name="menu-0"]')
				.on('change.stdnbind', 'select[name="menu-0"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-time').text(val);
					}
				});

			const initialDate = $cf7.find('input[name="date-285"]').val();
			if (initialDate) {
				$('.stdn-booking-date').text(initialDate);
			}
			const initialTime = $cf7.find('select[name="menu-0"]').val();
			if (initialTime) {
				$('.stdn-booking-time').text(initialTime);
			}
		}

		// Flyttstädning
		if (serviceName === 'Flyttstädning') {
			$cf7.off('change.stdnbind input.stdnbind', 'input[name="date-285"]')
				.on('change.stdnbind input.stdnbind', 'input[name="date-285"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-date').text(val);
					}
				});

			$cf7.off('change.stdnbind', 'select[name="menu-0"]')
				.on('change.stdnbind', 'select[name="menu-0"]', function () {
					const val = $(this).val();
					if (val) {
						$('.stdn-booking-time').text(val);
					}
				});

			const initialDate = $cf7.find('input[name="date-285"]').val();
			if (initialDate) {
				$('.stdn-booking-date').text(initialDate);
			}
			const initialTime = $cf7.find('select[name="menu-0"]').val();
			if (initialTime) {
				$('.stdn-booking-time').text(initialTime);
			}
		}

		// Trigger initial sync for prefilled values
		$cf7.find('input[name="date-285"]').trigger('change');
		$cf7.find('select[name="menu-0"]').trigger('change');
		$cf7.find('select[name="select-kpt"]').trigger('change');
		$cf7.find('select[name="select-freq"]').trigger('change');
		$cf7.find('select[name="select-ROK"]').trigger('change');
		$cf7.find('select[name="select-balkong"]').trigger('change');
	}

})(jQuery);
