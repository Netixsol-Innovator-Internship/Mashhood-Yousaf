function signUp(e) {
  e.preventDefault();

  let fullName = document.getElementById("fullNameInput").value;
  let email = document.getElementById("emailInput").value;
  let password = document.getElementById("passwordInput").value;
  let confirmPassword = document.getElementById("confirmPasswordInput").value;

  if (
    fullName.trim().length < 3 ||
    !email.trim() ||
    password.trim().length < 3
  ) {
    alert("All fields are required!");
    return;
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    alert("Enter Correct Email");
    return;
  }
  if (password !== confirmPassword) {
    alert("confirm password not Matched");
  }

  const userData = {
    fullName,
    email,
    password,
  };
  let usersArray = JSON.parse(localStorage.getItem("userData")) || [];

  let existingEmail = usersArray.find((user) => user.email === userData.email);

  if (existingEmail) {
    return alert("email Already Exists");
  }
  usersArray.push(userData);

  localStorage.setItem("userData", JSON.stringify(usersArray));
  window.location.href = "../signIn.html";
}

function signIn(e) {
  e.preventDefault();

  let email = document.getElementById("emailForLogin").value;
  let password = document.getElementById("passwordForLogin").value;

  let usersArray = JSON.parse(localStorage.getItem("userData")) || [];

  let findEmail = usersArray.find((user) => user.email === email);
  let matchPassword = usersArray.find((user) => user.password === password);

  if (!findEmail || !matchPassword) {
    alert("InValid Credentials!");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("loggedInUser", email);
  window.location.href = "../index.html";

  alert("User Logged In Successfully ");
}
