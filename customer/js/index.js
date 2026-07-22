document.addEventListener('DOMContentLoaded', () => {
      const handleLogin = () => {
        appState.login();
        window.location.href = 'home.html';
      };
      
      document.getElementById('google-btn').addEventListener('click', handleLogin);
      document.getElementById('phone-btn').addEventListener('click', handleLogin);
    });
