jQuery(function($) {

	function processCondition(event){
		$this = $(this);

		//reset all filters to start with
		$('.field').show();

		if ($this.val() == event.data.value){
			event.stopImmediatePropagation();

			//check if there are multiple conditions if so verify all of them meet the criteria
			// console.log('condition triggered');

			//process each field
			for(var field in event.data.options) {
				if(event.data.options.hasOwnProperty(field)){
					if (field == 'condition') continue;

					fieldOptions = event.data.options[field];
					$field = $('#field-' + field);

					if (fieldOptions.visible && fieldOptions.visible == 'no'){
						$field.hide();
					} else {
						$field.show();

						if ($field.hasClass('field-dynamictextgroup')){
							for(var key in fieldOptions.key) {
								$key = $field.find('.frame li.dtg .field-key').filter(function() { return $(this).val() === fieldOptions.key[key] });
								console.log($key);
								if ($key.length == 0){
									if ($field.find('.frame li.dtg .field-key').eq(0).val() == ""){
										//just place in the first item
										$field.find('.frame li.dtg .field-key').eq(0).val(fieldOptions.key[key])
									} else {
										//clone the duplicator and add a key value
										$newItem = $field.find('.frame li.template').clone();
										$newItem.find('.field-key').val(fieldOptions.key[key]);
										$newItem.removeClass().addClass('dtg');
										$field.find('.frame li.template').before($newItem);
									}
								}
								console.log(fieldOptions.key[key]);
							}
						}
					}
				}
			}
		}
	}

	$(document).on('ready.conditional-fields', function() {
		try {

			if (typeof(Symphony.ConditionalFields) == 'undefined')
				return;

			//there are conditional fields

			//register for on change events for each field which is conditional
			$(Symphony.ConditionalFields).each(function(index,object){
				for(var field in object.condition) {
					if(object.condition.hasOwnProperty(field)){
						$(document).on('change.conditional-fields','*[name="fields['+field+']"],*[name="fields['+field+'][]"]',{'value':object.condition[field],'options':object},processCondition);

						//in case this is already a set value trigger a change event to check
						$('*[name="fields['+field+']"],*[name="fields['+field+'][]"]').trigger('change.conditional-fields'); 
					}
				}
			});

		} catch (e) {}
	});

},(jQuery));