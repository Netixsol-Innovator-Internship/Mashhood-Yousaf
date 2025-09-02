let selectedTip = 0;

document.getElementById("tip5").addEventListener("click", function() {
  selectedTip = 5;
  setActiveTipButton(this);
  document.getElementById("custom").value = "";
  calculateTip();
});
document.getElementById("tip10").addEventListener("click", function() {
  selectedTip = 10;
  setActiveTipButton(this);
  document.getElementById("custom").value = "";
  calculateTip();
});
document.getElementById("tip15").addEventListener("click", function() {
  selectedTip = 15;
  setActiveTipButton(this);
  document.getElementById("custom").value = "";
  calculateTip();
});
document.getElementById("tip25").addEventListener("click", function() {
  selectedTip = 25;
  setActiveTipButton(this);
  document.getElementById("custom").value = "";
  calculateTip();
});
document.getElementById("tip50").addEventListener("click", function() {
  selectedTip = 50;
  setActiveTipButton(this);
  document.getElementById("custom").value = "";
  calculateTip();
});

const tipButtons = document.querySelectorAll("button[id^='tip']");

function setActiveTipButton(activeButton) {
  tipButtons.forEach((button) => {
    button.classList.remove("bg-[#26C2AE]", "text-[#00474B]");
    button.classList.add("bg-[#00474B]", "text-white");
  });

  activeButton.classList.remove("bg-[#00474B]", "text-white");
  activeButton.classList.add("bg-[#26C2AE]", "text-[#00474B]");
}

document.getElementById("custom").addEventListener("input", (e) => {
  const customTip = parseFloat(e.target.value);
  if (!isNaN(customTip) && customTip >= 0) {
    selectedTip = customTip;
    calculateTip();
  }
});

document.getElementById("bill").addEventListener("input", calculateTip);
document
  .getElementById("numberOfPeople")
  .addEventListener("input", calculateTip);

//
// function calculateTip(tipAmount) {
//   let billAmount = parseFloat(document.getElementById("bill").value);
//   let noOfPeople = parseInt(document.getElementById("numberOfPeople").value);

//   if (!billAmount || !noOfPeople || noOfPeople === 0) {
//     alert("Please enter a valid bill and number of people");
//     return;
//   }

//   let percentOfAmount = (tipAmount / 100) * billAmount;
//   let totalAmount = percentOfAmount + billAmount;

//   let tipPerPerson = percentOfAmount / noOfPeople;
//   let totalPerPerson = totalAmount / noOfPeople;

//   document.getElementById("tipAmount").innerHTML = `$${tipPerPerson.toFixed(
//     2
//   )}`;
//   document.getElementById("totalAmount").innerHTML = `$${totalPerPerson.toFixed(
//     2
//   )}`;

//   console.log("percentOfAmount", percentOfAmount);
//   console.log("totalAmount", totalAmount);
//   console.log("tipPerPerson", tipPerPerson);
//   console.log("totalPerPerson", totalPerPerson);
// }
//

function calculateTip() {
  let billAmount = parseFloat(document.getElementById("bill").value);
  let noOfPeople = parseInt(document.getElementById("numberOfPeople").value);

  if (!billAmount || !noOfPeople || noOfPeople === 0 || selectedTip === 0) {
    document.getElementById("tipAmount").innerHTML = "$0.00";
    document.getElementById("totalAmount").innerHTML = "$0.00";
    return;
  }

  if (isNaN(billAmount) || billAmount <= 0) {
    alert("Please enter a valid positive bill amount.");
    return;
  }

  if (isNaN(noOfPeople) || noOfPeople <= 0) {
    alert("Please enter a valid number of people (whole number > 0).");
    return;
  }

  let percentOfAmount = (selectedTip / 100) * billAmount;
  let totalAmount = percentOfAmount + billAmount;

  let tipPerPerson = percentOfAmount / noOfPeople;
  let totalPerPerson = totalAmount / noOfPeople;

  document.getElementById("totalBill").innerHTML = `$${totalAmount}`;

  document.getElementById("tipAmount").innerHTML = `$${tipPerPerson.toFixed(
    2
  )}`;
  document.getElementById("totalAmount").innerHTML = `$${totalPerPerson.toFixed(
    2
  )}`;
}

document.getElementById("resetBtn").addEventListener("click", function() {
  document.getElementById("totalBill").innerHTML = "$0.00";

  document.getElementById("bill").value = "";
  document.getElementById("numberOfPeople").value = "";
  document.getElementById("custom").value = "";
  document.getElementById("tipAmount").innerHTML = "$0.00";
  document.getElementById("totalAmount").innerHTML = "$0.00";
});
