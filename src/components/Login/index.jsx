import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './style.css'

const Login = () => {
  const webcamRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const [welcome, setIWelcome] = useState('');

  const videoConstraints = {
    width: 500,
    height: 400,
    facingMode: "user"
  };

  // Snapshot olish funksiyasi
  const takeSnapshot = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSnapshotUrl(imageSrc);
  };

  // Email va parol orqali kirish funksiyasi
  const handleLogin = async () => {
    const userData = { email, password };

    try {
      const response = await axios.post('https://face-auth-back.onrender.com/api/auth/login', userData);
      console.log('Foydalanuvchi muvaffaqiyatli kirdi:', response.data);
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
    }
  };

  // Yuz orqali kirish funksiyasi
  const handleFaceLogin = async () => {
    if (snapshotUrl) {
      try {
        const response = await axios.post('https://face-auth-back.onrender.com/api/auth/face-login', {
          picture: snapshotUrl,
        });
        console.log('Foydalanuvchi aniqlash natijasi:', response.data);
        setIWelcome(response.data.user.name)
      } catch (error) {
        console.error('Xatolik yuz berdi:', error);
      }
    }
  };

  return (
    <div>
      <h1>Kirish</h1>

      {/* Email va Parol orqali kirish */}
      {!isFaceLogin && (
        <div className='forma'>
          <div className='item-input'>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='item-input'>
            <label>Parol:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {/* Yuz bilan kirish */}
      {isFaceLogin && (
        <div className='webcam'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            width={500}
            height={400}
          />
          <button onClick={takeSnapshot}>Snapshot olish</button>

          {snapshotUrl && (
            <div>
              <h3>Snapshot:</h3>
              <img src={snapshotUrl} alt="Snapshot" style={{ width: '500px', height: '400px' }} />
              <button onClick={handleFaceLogin}>Yuz bilan kirish</button>
              <h1>
                {
                  welcome.length  > 0 ?  `Welcome, ${welcome}` : ""
                }
              </h1>
            </div>
          )}
        </div>
      )}

      {/* Yuz bilan kirish va Email orqali kirish o'rtasida almashtirish */}
      <button onClick={() => setIsFaceLogin(!isFaceLogin)}>
        {isFaceLogin ? "Email va Parol orqali kirish" : "Yuz bilan kirish"}
      </button>
    </div>
  );
};

export default Login;
