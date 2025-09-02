// function getValue(e) {
//   e.preventDefault();

//   let day = Number(document.getElementById("userDay").value);
//   let month = Number(document.getElementById("userMonth").value) - 1;
//   let year = Number(document.getElementById("userYear").value);

//   let birthDate = new Date(year, month, day);
//   console.log("birthDate.getFullYear()", birthDate.getFullYear());

//   let currentDate = new Date();
//   let currentYear = currentDate.getFullYear();
//   let currentMonth = currentDate.getMonth();
//   let currentDay = currentDate.getDate();

//   let calculatedYear = currentYear - birthDate.getFullYear();
//   let calculatedDay = currentDay - birthDate.getDate();
//   let calculatedMonth = currentMonth - birthDate.getMonth()  ;

//   console.log(calculatedYear, "Years");
//   console.log(calculatedMonth, "months");
//   console.log(calculatedDay, "date");

// }

function getValue(event) {
  event.preventDefault();

  let day = document.getElementById("userDay").value;
  let month = document.getElementById("userMonth").value; // adjust for 0-indexed months
  let year = document.getElementById("userYear").value;

  let isValid = true;

  if (!day || !month || !year) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }

  if (
    day.toString().length < 1 ||
    month.toString().length < 1 ||
    year.toString().length < 4
  ) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }

  if (
    day.toString().length > 2 ||
    month.toString().length > 2 ||
    year.toString().length > 4
  ) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }

  if (day < 1 || day > 31) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }
  if (month < 1 || month > 12) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }

  let currentDate = new Date();
  if (year < 1900 || year > currentDate.getFullYear()) {
    return (document.getElementById("errorText").innerHTML =
      "Please enter a valid Date.");
  } else {
    document.getElementById("errorText").innerHTML = "";
  }

  // doing -1 because month starts from 0th index
  let birthDate = new Date(year, month - 1, day);

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let date = currentDate.getDate() - birthDate.getDate();
  console.log("date", date);
  if (date < 0) {
    months -= 1;
    console.log("months in if block", months);
    let prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    date += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  console.log(years, "Years");
  console.log(months, "Months");
  console.log(date, "Days");

  // document.getElementById("years").innerHTML = years;
  // document.getElementById("months").innerHTML = months;
  // document.getElementById("days").innerHTML = date;
    animateCount(document.getElementById("years"), years);
    animateCount(document.getElementById("months"), months);
    animateCount(document.getElementById("days"), date);
}

function animateCount(element, target) {
  let current = 0;
  const duration = 1000; // Animation duration in ms
  const step = target / (duration / 16); // Small increment per frame (~60fps)

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      clearInterval(timer);
      current = target; // Ensure final value is exact
    }
    element.textContent = Math.floor(current); // Update display
  }, 16); // ~60fps
}