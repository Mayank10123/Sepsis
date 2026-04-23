import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function LiveVitalsChart({ patientId }) {
  const [data, setData] = useState([]);

  // Generate initial mock data
  useEffect(() => {
    const initialData = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      initialData.push({
        time: new Date(now.getTime() - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        hr: 110 + Math.floor(Math.random() * 10),
        spO2: 94 + Math.floor(Math.random() * 4),
        isPredicted: false
      });
    }
    // Add 5 predicted future points
    for (let i = 1; i <= 5; i++) {
        initialData.push({
          time: new Date(now.getTime() + i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          hr: 118 + i + Math.floor(Math.random() * 5), // Simulating a rising trend
          spO2: 93 - (i*0.5) + Math.floor(Math.random() * 2),
          isPredicted: true
        });
      }
    setData(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(currentData => {
        const nextData = [...currentData.slice(1)];
        nextData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          hr: 110 + Math.floor(Math.random() * 10),
          spO2: 94 + Math.floor(Math.random() * 4),
        });
        return nextData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#003f87" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#003f87" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="time" 
            hide={true} 
          />
          <YAxis 
            domain={[80, 130]} 
            tick={{ fontSize: 10, fill: '#727784' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
            formatter={(value, name, props) => [value, props.payload.isPredicted ? `${name} (PREDICTED)` : name]}
          />
          <Area 
            type="monotone" 
            dataKey="hr" 
            stroke="#ba1a1a" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorHr)" 
            animationDuration={1000}
            isAnimationActive={false}
            strokeDasharray={props => props.payload?.isPredicted ? "5 5" : "0"}
          />
          <Area 
            type="monotone" 
            dataKey="spO2" 
            stroke="#003f87" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorO2)" 
            animationDuration={1000}
            isAnimationActive={false}
            strokeDasharray={props => props.payload?.isPredicted ? "5 5" : "0"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
