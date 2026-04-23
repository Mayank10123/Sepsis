import React from 'react';
import { motion } from 'framer-motion';
import './SentinelWardMap.css';

export default function SentinelWardMap() {
  const rooms = [
    { id: '401', risk: 'low', label: 'Stable' },
    { id: '402', risk: 'medium', label: 'Watch' },
    { id: '403', risk: 'high', label: 'Critical' },
    { id: '404', risk: 'low', label: 'Stable' },
    { id: '405', risk: 'low', label: 'Stable' },
    { id: '406', risk: 'medium', label: 'Watch' },
    { id: '407', risk: 'high', label: 'Critical' },
    { id: '408', risk: 'low', label: 'Stable' }
  ];

  return (
    <div className="ward-map-widget sg-card">
      <header className="map-header">
        <div className="map-title">
          <span className="material-symbols-outlined">map</span>
          <h3>ICU Ward West Heatmap</h3>
        </div>
        <div className="map-legend">
           <span className="leg-item"><span className="dot low"></span> Stable</span>
           <span className="leg-item"><span className="dot high"></span> Risk</span>
        </div>
      </header>

      <div className="ward-grid-visual">
         {/* Simple floorplan representation */}
         <div className="ward-hallway">Nurses Station</div>
         <div className="rooms-container">
            {rooms.slice(0, 4).map(room => (
              <motion.div 
                key={room.id} 
                className={`room-node ${room.risk}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="room-num">{room.id}</div>
                {room.risk === 'high' && <div className="room-alert-pulse"></div>}
              </motion.div>
            ))}
         </div>
         <div className="rooms-container">
            {rooms.slice(4, 8).map(room => (
              <motion.div 
                key={room.id} 
                className={`room-node ${room.risk}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="room-num">{room.id}</div>
                {room.risk === 'high' && <div className="room-alert-pulse"></div>}
              </motion.div>
            ))}
         </div>
      </div>

      <footer className="map-footer">
         <p>Real-time occupancy: <strong>88%</strong> | Sentinel Coverage: <strong>Active</strong></p>
      </footer>
    </div>
  );
}
