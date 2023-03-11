
const numberInput = document.querySelector('#floatingInput');

numberInput.addEventListener('input', function(event) {
  // Get the input value and remove any commas
  let value = event.target.value.replace(/,/g, '');

  // Format the value with commas
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Set the formatted value back into the input field
  event.target.value = value;
});

console.log('Amadike Sullivan Chigozie')