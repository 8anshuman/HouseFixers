const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');

const authSection = document.getElementById('authSection');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const loginSubmit = document.getElementById('loginSubmit');
const signupSubmit = document.getElementById('signupSubmit');

const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');

const servicesSection = document.getElementById('servicesSection');
const serviceButtons = document.querySelectorAll('.serviceBtn');
const serviceMessage = document.getElementById('serviceMessage');

const welcomeSection = document.getElementById('welcomeSection');

let authToken = null;

function showLogin() {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  loginMessage.textContent = '';
  signupMessage.textContent = '';
  authSection.style.display = 'block';
}

function showSignup() {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  loginMessage.textContent = '';
  signupMessage.textContent = '';
  authSection.style.display = 'block';
}

function showLoggedIn() {
  loginBtn.style.display = 'none';
  signupBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  authSection.style.display = 'none';
  servicesSection.style.display = 'block';
  welcomeSection.style.display = 'none';
  serviceMessage.textContent = '';
}

function showLoggedOut() {
  loginBtn.style.display = 'inline-block';
  signupBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
  authSection.style.display = 'none';
  servicesSection.style.display = 'none';
  welcomeSection.style.display = 'block';
  authToken = null;
  localStorage.removeItem('authToken');
}

loginBtn.addEventListener('click', () => {
  console.log('Login button clicked');
  showLogin();
});

signupBtn.addEventListener('click', () => {
  console.log('Signup button clicked');
  showSignup();
});

logoutBtn.addEventListener('click', () => {
  showLoggedOut();
});

loginSubmit.addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  if (!username || !password) {
    loginMessage.textContent = 'Please enter username and password.';
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      authToken = data.token;
      localStorage.setItem('authToken', authToken);
      showLoggedIn();
    } else {
      loginMessage.textContent = data.message || 'Login failed.';
    }
  } catch (err) {
    loginMessage.textContent = 'Error connecting to server.';
  }
});

signupSubmit.addEventListener('click', async () => {
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  if (!username || !password) {
    signupMessage.textContent = 'Please enter username and password.';
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      signupMessage.style.color = 'green';
      signupMessage.textContent = 'Signup successful. You can now login.';
      showLogin();
    } else {
      signupMessage.style.color = 'red';
      signupMessage.textContent = data.message || 'Signup failed.';
    }
  } catch (err) {
    signupMessage.style.color = 'red';
    signupMessage.textContent = 'Error connecting to server.';
  }
});

// Booking form submission handler
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const formMessage = document.getElementById('formMessage');
  if (!form || !formMessage) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.style.color = 'green';
    // Determine service type from page title or heading
    const serviceName = document.querySelector('h2')?.textContent.replace('Book Service: ', '') || 'service';
    formMessage.textContent = `Booking submitted successfully for ${serviceName}.`;
    form.reset();
  });
}

// Autocomplete feature for location input
function initAutocomplete() {
  const input = document.getElementById('locationInput');
  if (!input) return;

  // Predefined list of locations for autocomplete
  const locations = [
    "Indore",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur"
  ];

  let currentFocus;

  input.addEventListener("input", function() {
    const val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;

    const listContainer = document.createElement("DIV");
    listContainer.setAttribute("id", this.id + "autocomplete-list");
    listContainer.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(listContainer);

    for (let i = 0; i < locations.length; i++) {
      if (locations[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        const item = document.createElement("DIV");
        item.innerHTML = "<strong>" + locations[i].substr(0, val.length) + "</strong>";
        item.innerHTML += locations[i].substr(val.length);
        item.innerHTML += "<input type='hidden' value='" + locations[i] + "'>";
        item.addEventListener("click", function() {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        listContainer.appendChild(item);
      }
    }
  });

  input.addEventListener("keydown", function(e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < items.length; i++) {
      if (elmnt != items[i] && elmnt != input) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// On page load, check if user is logged in, initialize autocomplete and booking form
window.addEventListener('load', () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authToken = token;
    showLoggedIn();
  } else {
    showLoggedOut();
  }
  initAutocomplete();
  initBookingForm();
});
</create_file>
