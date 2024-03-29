const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#loginEmail').value.trim();
    const password = document.querySelector('#loginPassword').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to log in.');
      }
    }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#signupUsername').value.trim();
  const email = document.querySelector('#signupEmail').value.trim();
  const password = document.querySelector('#signupPassword').value.trim();

  if(username && email && password){
    const response = await fetch('/api/users/', {
      method: 'POST',
      body: JSON.stringify({username, email, password}),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      document.location.replace('/');
    }
    else{
      alert('Failed to log in.');
    };
  };
};


  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);

  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);