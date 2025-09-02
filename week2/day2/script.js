let notificationCount = 3;

function updateNotificationCount() {
  document.getElementById("notification").innerHTML = notificationCount;
}

document.getElementById("markAsReadBtn").addEventListener("click", function () {
  let isMsgRead = false;
  let notifications = document.querySelectorAll(".bg-blue-50");
  notifications.forEach((notification) => {
    notification.style.backgroundColor = "white";
  });
  let notificationsDot = document.querySelectorAll(".bg-red-500");
  notificationsDot.forEach((notification) => {
    notification.style.backgroundColor = "white";
  });
  notificationCount = 0;
  updateNotificationCount();
});

document
  .getElementById("addNotificationModal")
  .addEventListener("click", function () {
    document.getElementById("inputModal").style.display = "block";
  });

document
  .getElementById("closeModal")
  .addEventListener("click", function modalDown() {
    document.getElementById("inputModal").style.display = "none";
  });

function modalDown() {
  const modal = document.getElementById("inputModal");
  // if (modal) {
  modal.style.display = "none";
  // }
}

// let userName = document.getElementById("userName").value;
// let userMsg = document.getElementById("userMsg").value;

// console.log("userName:", userName);
// console.log("userMsg:", userMsg);

function handleSubmit(event) {
  event.preventDefault();

  let userName = document.getElementById("userName").value;
  let userMsg = document.getElementById("userMsg").value;

  let box = document.getElementById("msgBox");
  let newMessage = document.createElement("div");
  newMessage.className =
    "flex animate-slide-in gap-3 p-3 bg-blue-50 rounded-lg mb-3";
  newMessage.innerHTML = ` <img src="./assets/images/defaultDP.png" alt="${userName}" class="w-10 h-10 rounded-full">
   <div class="flex-1">
      <p class="text-sm max-w-[32rem] break-words">
        <span class=" font-bold">${userName}</span> says:
        <span class="text-gray-800">${userMsg}</span>
        <span  class="block w-2 h-2 bg-red-500 rounded-full inline-block ml-1"></span>
      </p>
      <p class="text-gray-500 text-sm">JustNow</p>
    </div>
   `;
  box.appendChild(newMessage);

  localStorage.setItem("chatNotifications", box.innerHTML);

  notificationCount++;
  updateNotificationCount();

  modalDown();
}

document.addEventListener("keydown", function (e) {
  if (
    e.key === "F5" ||
    e.key === "Refresh" ||
    (e.ctrlKey && e.key === "r") ||
    (e.ctrlKey && e.key === "R")
  ) {
    e.preventDefault();
    alert(
      "Refresh is disabled on this page, You will lost your msgs,  Press ctrl + p for Refresh "
    );
  }

  if (e.ctrlKey && e.key === "p") {
    e.preventDefault(); // Prevent print dialog (optional)
    console.log("Custom refresh triggered!");
    window.location.reload(); // Force refresh
  }
});
