import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', role: 'user', ville: '', nom: '', adresse: '', types_reparation: []
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const types = formData.types_reparation.includes(e.target.value)
      ? formData.types_reparation.filter(t => t !== e.target.value)
      : [...formData.types_reparation, e.target.value];
    setFormData({ ...formData, types_reparation: types });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);  // Prod: env URL
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Inscription</Typography>
      <TextField name="email" label="Email" onChange={handleChange} />
      <TextField name="password" label="Mot de passe" type="password" onChange={handleChange} />
      <FormControlLabel control={<Checkbox value="user" checked={formData.role === 'user'} onChange={() => setFormData({ ...formData, role: 'user' })} />} label="Utilisateur" />
      <FormControlLabel control={<Checkbox value="pro" checked={formData.role === 'pro'} onChange={() => setFormData({ ...formData, role: 'pro' })} />} label="Pro" />
      {formData.role === 'pro' && (
        <>
          <TextField name="nom" label="Nom" onChange={handleChange} />
          <TextField name="adresse" label="Adresse" onChange={handleChange} />
          <Typography>Types réparation :</Typography>
          <FormControlLabel control={<Checkbox value="freins" onChange={handleCheckbox} />} label="Freins" />
          <FormControlLabel control={<Checkbox value="pneus" onChange={handleCheckbox} />} label="Pneus" />
          {/* Ajoute plus */}
        </>
      )}
      <TextField name="ville" label="Ville" onChange={handleChange} />
      <Button type="submit">S'inscrire</Button>
    </form>
  );
};

export default Register;