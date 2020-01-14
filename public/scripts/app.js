// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// Add form inputs (taken from: https://www.sanwebe.com/2013/03/addremove-input-fields-dynamically-with-jquery)
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


// GRABBED THIS FROM https://www.codexworld.com/add-remove-input-fields-dynamically-using-jquery/
// $(document).ready(function(){
//     var maxField = 5; //Input fields increment limitation
//     var addButton = $('.add_button'); //Add button selector
//     var wrapper = $('.field_wrapper'); //Input field wrapper
//     var fieldHTML = '<div><input type="text" name="field_name[]" value=""/><a href="javascript:void(0);" class="remove_button"><img src="remove-icon.png"/></a></div>'; //New input field html
//     var x = 1; //Initial field counter is 1

//     //Once add button is clicked
//     $(addButton).click(function(){
//         //Check maximum number of input fields
//         if(x < maxField){
//             x++; //Increment field counter
//             $(wrapper).append(fieldHTML); //Add field html
//         }
//     });

//     //Once remove button is clicked
//     $(wrapper).on('click', '.remove_button', function(e){
//         e.preventDefault();
//         $(this).parent('div').remove(); //Remove field html
//         x--; //Decrement field counter
//     });
// });
