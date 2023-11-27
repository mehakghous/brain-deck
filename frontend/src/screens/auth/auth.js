
(() => {
  const user = JSON.parse(localStorage.getItem("user") || `{}`)
  if (user.email) {
    window.location.href = `../home/home.html`
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
    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: JSON.stringify(formProps),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    const resbody = await response.json()
    localStorage.setItem("user", JSON.stringify(resbody))
    window.location.href = '../home/home.html';
  } catch (error) {
    alert("Wrong email password!")
    console.log("🚀 ~ file: auth.js:49 ~ handleLogin ~ error:", error)
  }

}

async function handleSignUp(e) {
  try {
    const formData = new FormData(e);
    const formProps = Object.fromEntries(formData);
    const response = await fetch("http://localhost:4000/api/signup", {
      method: "POST",
      body: JSON.stringify(formProps),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const resbody = await response.json();
    localStorage.setItem("user", JSON.stringify(resbody))
    window.location.href = "../home/home.html";
  } catch (error) {
    console.log("🚀 ~ file: auth.js:73 ~ handleSignUp ~ error:", error)
  }
}
