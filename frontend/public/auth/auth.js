
(() => {
  const user = JSON.parse(localStorage.getItem("user") || `{}`)
  if (user.email) {
    window.location.href = `../index.html`
  }
})()

function openTab(tabName, clickedTab) {
  var tabs = document.querySelectorAll('.tab');
  var contents = document.querySelectorAll('.content');

  // Remove 'active' class from all tabs
  tabs.forEach(function (tab) {
    tab.classList.remove('active');
  });

  // Hide all content sections
  contents.forEach(function (content) {
    content.style.display = 'none';
  });

  // Display the content for the clicked tab
  document.getElementById(tabName).style.display = 'block';
  console.log(tabName);

  // Add 'active' class to the clicked tab
  clickedTab.classList.add('active');
}

async function handleLogin(e) {
  try {
    const formData = new FormData(e);
    const formProps = Object.fromEntries(formData);
    const response = await fetch("https://convenient-margret-mehakghous-8713c5cc.koyeb.app/api/login", {
      method: "POST",
      body: JSON.stringify(formProps),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    const resbody = await response.json()
    localStorage.setItem("user", JSON.stringify(resbody))
    window.location.href = '../index.html';
  } catch (error) {
    alert("Wrong email password!")
    console.log("🚀 ~ file: auth.js:49 ~ handleLogin ~ error:", error)
  }

}

async function handleSignUp(e) {
  try {
    const formData = new FormData(e);
    const formProps = Object.fromEntries(formData);
    const response = await fetch("https://convenient-margret-mehakghous-8713c5cc.koyeb.app/api/signup", {
      method: "POST",
      body: JSON.stringify(formProps),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const resbody = await response.json();
    localStorage.setItem("user", JSON.stringify(resbody))
    window.location.href = "../index.html";
  } catch (error) {
    console.log("🚀 ~ file: auth.js:73 ~ handleSignUp ~ error:", error)
  }
}
