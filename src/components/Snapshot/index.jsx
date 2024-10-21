import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './style.css'

const Snapshot = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const videoConstraints = {
    width: 500,
    height: 400,
    facingMode: 'user'
  };

  // Snapshot olish funksiyasi
  const takeSnapshot = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSnapshotUrl(imageSrc);
  };

  // Form ma'lumotlarini yuborish
  const handleSubmit = async (e) => {
    e.preventDefault(); // Form yuborilishini to'xtatish
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('picture', snapshotUrl); // Bu erda tasvirni yuklaymiz

    try {
      const response = await axios.post('https://face-auth-back.onrender.com/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Kontent turini ko'rsatish
        },
      });
      console.log('Foydalanuvchi ma\'lumotlari saqlandi:', response.data);
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
    }
  };

  return (
    <div>
      <h1>Foydalanuvchini Ro'yxatdan O'tkazish</h1>
      <form onSubmit={handleSubmit} className='forma'>
        <div className='item-input'> 
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className='item-input'>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className='item-input'>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* Kamera va snapshot olish */}
        <div className='webcam'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            width={500}
            height={400}
          />
          <button type="button" onClick={takeSnapshot}>Snapshot</button>
        </div>

        {snapshotUrl && (
          <div>
            <h3>Snapshot olingan tasvir:</h3>
            <img src={snapshotUrl} alt="Snapshot" style={{ width: '500px', height: '400px' }} />
          </div>
        )}

        <button type="submit">Ma'lumotlarni Yuborish</button>
      </form>
      <hr />
    </div>
  );
};

export default Snapshot;
