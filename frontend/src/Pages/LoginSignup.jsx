import React, { useState } from 'react'
import './css/LoginSignup.css';


const LoginSignup = () => {
  const [login, setLogin] = useState('Sign Up');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const changeHandler = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }


  const loginMethod = async () =>{
    console.log("Login method");
    let responseData;
    await fetch('http://localhost:4000/login',{
              method: 'POST',
              headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',

              },
              body: JSON.stringify(formData)
          })
          .then((res) => res.json())
          .then(data => responseData = data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }else{
      alert(responseData.message);
    }

  }
  const signUpMethod = async () =>{
    console.log("Sign Up method");
    console.log(formData);

    let responseData;
    await fetch('http://localhost:4000/signup',{
              method: 'POST',
              headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',

              },
              body: JSON.stringify(formData)
          })
          .then((res) => res.json())
          .then(data => responseData = data)
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }else{
      alert(responseData.message);
    }
  }
  return (
    <div className='loginsignup'>
        <div className="loginsignup-container">
          <h1>
            {login}
          </h1> 
          <div className="loginsignup-fields">
           {login === "Sign Up" ?
            <input type="text" value={formData.name} onChange={changeHandler} name='name' placeholder='Your name' />:
            <></>}
            <input type="email" name='email' value={formData.email} onChange={changeHandler} placeholder='Email address' />
            <input type="password" value={formData.password} onChange={changeHandler} name='password' placeholder='Password' />
          </div>
          <button onClick={() => {login === "Sign Up" ? signUpMethod() : loginMethod()}}>{login === "Sign Up" ? "Sign Up" : "Login"}</button>
          {
            login === "Sign Up"
            ?
            <p className='loginsignup-login'>Already hava an account? <span onClick={() => setLogin("Login")}>Login here</span></p> 
            :
            <p className='loginsignup-login'>Create an Account? <span onClick={() => setLogin("Sign Up")}>Click here</span></p> 
          }
          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" />
            <p>By continuing, I agree to the terms of use & private policy </p>
          </div>
        </div>
    </div>
  )
}

export default LoginSignup