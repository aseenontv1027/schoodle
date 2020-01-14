// Add form inputs to main form
$(document).ready(function() {
  const max_fields      = 10;
  const wrapper         = $(".input_fields_wrap");
  const add_button      = $(".add_field_button");
  const remove_button   = $(".remove_field_button");
  let optionNum = 0;

  const html = num => `<div><input type="datetime-local" name="option[${num}]" class="form-control" /></div>`


  $(add_button).click(function(e){
      e.preventDefault();
      optionNum++;
      let total_fields = wrapper[0].children.length;
      if(total_fields < max_fields) {
          $(wrapper).append(html(optionNum));
      }
  });

  $(remove_button).click(function(e){
      e.preventDefault();
      if (optionNum > 1) {
        optionNum--;
      }
      let total_fields = wrapper[0].children.length;
      if(total_fields > 1) {
          wrapper[0].children[total_fields - 1].remove();
      }
  });
});
