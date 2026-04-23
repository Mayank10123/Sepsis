"""
SepsisGuard Backend - AI Agent for Sepsis Risk Detection
Analyzes 10+ vital signals using Groq.ai LLM
"""

import json
from typing import Dict, List
from datetime import datetime
import statistics

class SepsisRiskAgent:
    """AI agent that monitors patient vitals and calculates sepsis risk"""
    
    def __init__(self, groq_client):
        self.groq_client = groq_client
        self.model = "mixtral-8x7b-32768"  # Fast LLM model
    
    def analyze_patient(self, patient_data: Dict) -> Dict:
        """
        Analyze patient vitals and calculate sepsis risk
        
        Args:
            patient_data: {
                'patient_id': str,
                'vitals': {'hr': int, 'o2': int, 'bp_sys': int, 'bp_dia': int, 
                          'temp': float, 'rr': int, 'lactate': float, 'wbc': float},
                'baseline': dict,  # Patient's normal ranges
                'history': list,   # Last 24h vitals
                'metadata': {'age': int, 'comorbidities': list, 'meds': list}
            }
        
        Returns:
            {
                'patient_id': str,
                'risk_score': 0-100,
                'risk_level': 'green'|'yellow'|'red'|'critical',
                'factors': ['Lactate ↑', 'Temp trend +1.1°C', 'HR acceleration'],
                'explanation': 'LLM-generated clinical reasoning',
                'timestamp': ISO datetime
            }
        """
        
        # 1. Feature Engineering
        features = self._extract_features(patient_data)
        
        # 2. Send to Groq.ai LLM for reasoning
        risk_analysis = self._call_groq_ai(features, patient_data)
        
        # 3. Parse and structure response
        risk_response = self._parse_risk_response(risk_analysis)
        
        # 4. Determine overall risk level
        risk_level = self._calculate_risk_level(risk_response['risk_score'])
        
        return {
            'patient_id': patient_data['patient_id'],
            'risk_score': risk_response['risk_score'],
            'risk_level': risk_level,
            'factors': risk_response['factors'],
            'explanation': risk_response['explanation'],
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _extract_features(self, patient_data: Dict) -> Dict:
        """Extract clinically relevant features from vitals"""
        vitals = patient_data['vitals']
        baseline = patient_data.get('baseline', {})
        history = patient_data.get('history', [])
        
        features = {
            'current_vitals': vitals,
            'deviations': {},
            'trends': {},
            'patterns': {}
        }
        
        # 1. Deviations from baseline
        for key in vitals:
            if key in baseline:
                deviation = vitals[key] - baseline[key]
                features['deviations'][key] = deviation
        
        # 2. Trend detection (if history available)
        if len(history) >= 3:
            for key in vitals:
                values = [h.get(key) for h in history[-5:] if h.get(key)]
                if len(values) >= 2:
                    # Simple slope calculation
                    slope = (values[-1] - values[0]) / len(values)
                    features['trends'][f'{key}_slope'] = slope
        
        # 3. Multi-signal patterns
        features['patterns'] = self._detect_patterns(vitals)
        
        return features
    
    def _detect_patterns(self, vitals: Dict) -> Dict:
        """Detect sepsis-suspicious multi-signal patterns"""
        patterns = {}
        
        # Pattern 1: HR elevation + Temp elevation + RR elevation
        if vitals.get('hr', 0) > 100 and vitals.get('temp', 0) > 38 and vitals.get('rr', 0) > 20:
            patterns['triad_elevation'] = True  # Classic sepsis marker
        
        # Pattern 2: Lactate elevation
        if vitals.get('lactate', 0) > 2.5:
            patterns['lactate_elevated'] = True
        
        # Pattern 3: WBC abnormality (too high or too low)
        wbc = vitals.get('wbc', 0)
        if wbc > 11 or wbc < 4:
            patterns['wbc_abnormal'] = True
        
        # Pattern 4: O2 desaturation
        if vitals.get('o2', 100) < 94:
            patterns['o2_low'] = True
        
        return patterns
    
    def _call_groq_ai(self, features: Dict, patient_data: Dict) -> str:
        """Call Groq.ai LLM for clinical reasoning"""
        
        # Prepare context for LLM
        prompt = f"""
You are a clinical AI assistant analyzing patient vitals for early sepsis detection.

Patient Analysis:
- Age: {patient_data['metadata'].get('age', 'N/A')}
- Comorbidities: {', '.join(patient_data['metadata'].get('comorbidities', []))}

Current Vitals:
- Heart Rate (HR): {features['current_vitals'].get('hr')} bpm
- Oxygen (O2): {features['current_vitals'].get('o2')}%
- Temperature: {features['current_vitals'].get('temp')}°C
- Respiratory Rate (RR): {features['current_vitals'].get('rr')} breaths/min
- Blood Pressure: {features['current_vitals'].get('bp_sys')}/{features['current_vitals'].get('bp_dia')}
- Lactate: {features['current_vitals'].get('lactate')} mmol/L
- WBC: {features['current_vitals'].get('wbc')} K/μL

Deviations from baseline:
{json.dumps(features.get('deviations', {}), indent=2)}

Detected patterns:
{json.dumps(features.get('patterns', {}), indent=2)}

Based on this data, provide:
1. Risk Score (0-100): A numerical risk score for sepsis
2. Top 3 Risk Factors: List the most concerning vital deviations
3. Clinical Reasoning: Explain your assessment in 2-3 sentences
4. Recommendation: What should the care team consider?

Format your response as JSON:
{{
    "risk_score": <0-100>,
    "risk_factors": ["factor1", "factor2", "factor3"],
    "reasoning": "Your clinical assessment",
    "recommendation": "Suggested action"
}}
"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,  # More deterministic
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq.ai: {e}")
            return self._fallback_risk_calculation(features)
    
    def _fallback_risk_calculation(self, features: Dict) -> str:
        """Fallback if Groq.ai unavailable"""
        # Simple heuristic-based scoring
        risk_score = 50  # Start neutral
        factors = []
        
        vitals = features['current_vitals']
        
        # Adjust score based on vital deviations
        if vitals.get('temp', 0) > 38.5:
            risk_score += 15
            factors.append("Temperature elevation")
        
        if vitals.get('hr', 0) > 110:
            risk_score += 10
            factors.append("Tachycardia")
        
        if vitals.get('lactate', 0) > 2.5:
            risk_score += 20
            factors.append("Lactate elevation")
        
        if vitals.get('o2', 100) < 94:
            risk_score += 15
            factors.append("Hypoxia")
        
        risk_score = min(risk_score, 100)
        
        return json.dumps({
            "risk_score": risk_score,
            "risk_factors": factors[:3],
            "reasoning": f"Risk calculated from {len(factors)} concerning vitals",
            "recommendation": "Consult physician for clinical assessment"
        })
    
    def _parse_risk_response(self, response_text: str) -> Dict:
        """Parse LLM response"""
        try:
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            json_str = response_text[json_start:json_end]
            data = json.loads(json_str)
            
            return {
                'risk_score': min(max(int(data.get('risk_score', 50)), 0), 100),
                'factors': data.get('risk_factors', [])[:3],
                'explanation': data.get('reasoning', 'Risk assessment complete')
            }
        except Exception as e:
            print(f"Error parsing response: {e}")
            return {
                'risk_score': 50,
                'factors': ['Assessment pending'],
                'explanation': 'Unable to parse response'
            }
    
    def _calculate_risk_level(self, risk_score: int) -> str:
        """Map risk score to clinical level"""
        if risk_score < 30:
            return 'green'
        elif risk_score < 60:
            return 'yellow'
        elif risk_score < 85:
            return 'red'
        else:
            return 'critical'


# Background task for FastAPI
async def monitor_patient(patient_id: str, db, groq_client, alert_engine):
    """Background task: Monitor single patient every 60 seconds"""
    
    agent = SepsisRiskAgent(groq_client)
    
    while True:
        try:
            # Fetch latest vitals from MongoDB
            patient = db.patients.find_one({'_id': patient_id})
            vitals = db.vitals.find_one(
                {'patient_id': patient_id},
                sort=[('timestamp', -1)]
            )
            
            if patient and vitals:
                # Analyze
                risk_result = agent.analyze_patient({
                    'patient_id': patient_id,
                    'vitals': vitals['readings'],
                    'baseline': patient['baseline_vitals'],
                    'history': list(db.vitals.find(
                        {'patient_id': patient_id},
                        {'timestamp': -1}
                    ).limit(24)),
                    'metadata': {
                        'age': patient['age'],
                        'comorbidities': patient.get('comorbidities', []),
                        'meds': patient.get('medications', [])
                    }
                })
                
                # Save to MongoDB
                db.risk_scores.insert_one(risk_result)
                
                # Check if alert should trigger
                prev_risk = db.risk_scores.find_one(
                    {'patient_id': patient_id},
                    sort=[('timestamp', -1)],
                    skip=1
                )
                
                if prev_risk and risk_result['risk_score'] - prev_risk['risk_score'] > 15:
                    # Alert triggered!
                    await alert_engine.trigger_alert(patient_id, risk_result)
            
            await asyncio.sleep(60)  # Monitor every 60 seconds
            
        except Exception as e:
            print(f"Error monitoring patient {patient_id}: {e}")
            await asyncio.sleep(60)
