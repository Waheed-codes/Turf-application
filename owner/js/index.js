// Redirect if already logged in
    if (isOwnerLoggedIn()) {
      window.location.href = 'portal.html';
    }

    function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const errorEl = document.getElementById('login-error');

      if (ownerLogin(email, password)) {
        window.location.href = 'portal.html';
      } else {
        errorEl.style.display = 'block';
        document.getElementById('password').value = '';
      }
    }

    function autoFill() {
      document.getElementById('email').value = 'owner@venuex.com';
      document.getElementById('password').value = 'venue123';
      document.getElementById('login-error').style.display = 'none';
    }
