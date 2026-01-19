import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const SearchPro: React.FC<{ onSelectPro: (proId: number) => void }> = ({ onSelectPro }) => {
  const [ville, setVille] = useState('');
  const [typeRep, setTypeRep] = useState('');
  const [pros, setPros] = useState([]);

  const search = async () => {
    const res = await axios.get(`http://localhost:5000/pros?ville=${ville}&type=${typeRep}`);
    setPros(res.data);
  };

  return (
    <>
      <TextField label="Ville" value={ville} onChange={e => setVille(e.target.value)} />
      <TextField label="Type réparation" value={typeRep} onChange={e => setTypeRep(e.target.value)} />
      <Button onClick={search}>Rechercher</Button>
      <List>
        {pros.map((pro: any) => (
          <ListItem key={pro.id} button onClick={() => onSelectPro(pro.id)}>
            <ListItemText primary={pro.nom} secondary={`${pro.adresse} - Types: ${pro.types.join(', ')}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SearchPro;