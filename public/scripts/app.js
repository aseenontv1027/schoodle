// Add form inputs to main form
$(document).ready(function() {

  const wrapper         = $(".input_fields_wrap");
  const add_button      = $(".add_field_button");
  const remove_button   = $(".remove_field_button");

  const max_fields      = 10;
  let optionNum = 0;

  // input to add
  const html = num => `<div class="input_time"><input type="datetime-local" name="option[${num}]" class="form-control" required/></div>`;

  // add on click
  $(add_button).click(function(e){
      //e.preventDefault(); No need of this line since <button> is type="button"; By default <button> submits
      optionNum++;

      let total_fields = wrapper[0].children.length;
      if(total_fields < max_fields) {
          wrapper.append(html(optionNum));
      }
  });

  // remove on click
  $(remove_button).click(function(e){
      // e.preventDefault();
      if (optionNum > 1) {
        optionNum--;
      }
      let total_fields = wrapper[0].children.length;
      if(total_fields > 1) {
          wrapper[0].children[total_fields - 1].remove();
      }
  });

  $(".form-check-input").on('change', function() {
    if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      $('#'+$(this).attr('name')+'-hidden').attr("disabled", true);
    } else {
      $('#'+$(this).attr('name')+'-hidden').attr("disabled", false);
      $(this).attr('value', 'false');
    }
  });
});
