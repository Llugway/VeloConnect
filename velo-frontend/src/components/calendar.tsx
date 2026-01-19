import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const ProCalendar: React.FC<{ proId?: number; isPro: boolean }> = ({ proId, isPro }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (proId) {
      axios.get(`http://localhost:5000/dispos/${proId}`).then(res => {
        const evts = res.data.map((d: any) => ({
          title: d.disponible ? 'Disponible' : 'Réservé',
          start: new Date(`${d.date}T${d.heure}:00`),
          end: new Date(`${d.date}T${d.heure}:00`),  // Slot 1h simplifié
          allDay: false,
          resource: d.id
        }));
        setEvents(evts);
      });
    }
  }, [proId]);

  const handleSelectSlot = async ({ start }: any) => {
    if (isPro) {
      // Ajout dispo pour pro
      await axios.post('http://localhost:5000/dispos', {
        date: moment(start).format('YYYY-MM-DD'),
        heure: moment(start).format('HH:mm')
      });
    } else {
      // Booking pour user
      const dispoId = prompt('Entrez dispo ID');  // Simplifié, prod: from event
      await axios.post('http://localhost:5000/rdv', { dispo_id: dispoId });
    }
    // Refresh events
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      selectable
      onSelectSlot={handleSelectSlot}
    />
  );
};

export default ProCalendar;