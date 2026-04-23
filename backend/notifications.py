"""
Multi-Channel Alert System for SepsisGuard
Sends alerts via SMS (Twilio), Email (SendGrid), and In-App
"""

from datetime import datetime
from typing import Dict
from twilio.rest import Client as TwilioClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
import os
from dotenv import load_dotenv

load_dotenv()

class AlertEngine:
    """Manages alert generation and multi-channel delivery"""
    
    def __init__(self, db):
        self.db = db
        self.twilio_client = TwilioClient(
            os.getenv('TWILIO_ACCOUNT_SID'),
            os.getenv('TWILIO_AUTH_TOKEN')
        )
        self.from_phone = os.getenv('TWILIO_PHONE_NUMBER')
        self.sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
    
    async def trigger_alert(self, patient_id: str, risk_data: Dict):
        """
        Trigger alert across all channels
        
        Args:
            patient_id: Patient ID
            risk_data: {
                'risk_score': int,
                'risk_level': str,
                'factors': list,
                'explanation': str
            }
        """
        
        # Get patient and associated users
        patient = await self.db.patients.find_one({'_id': patient_id})
        doctor = await self.db.users.find_one({'_id': patient['assigned_doctor']})
        family = await self.db.users.find_one({'role': 'family', 'associated_patient': patient_id})
        
        # Create alert record
        alert_record = {
            'patient_id': patient_id,
            'risk_score': risk_data['risk_score'],
            'risk_level': risk_data['risk_level'],
            'factors': risk_data['factors'],
            'explanation': risk_data['explanation'],
            'timestamp': datetime.utcnow().isoformat(),
            'acknowledged': False,
            'sent': False
        }
        
        # 1. Send to Doctor (detailed, urgent)
        if doctor:
            doctor_message = self._format_doctor_alert(patient, risk_data)
            alert_record['doctor_id'] = doctor['_id']
            
            # SMS
            await self._send_sms(doctor['phone'], doctor_message['sms'])
            print(f"✅ SMS sent to doctor: {doctor_message['sms'][:50]}...")
            
            # Email
            await self._send_email(
                doctor['email'],
                doctor_message['subject'],
                doctor_message['email_html']
            )
            print(f"✅ Email sent to doctor")
            
            # In-app notification
            await self._save_in_app_notification(doctor['_id'], doctor_message['in_app'])
        
        # 2. Send to Patient (calm, simple)
        if risk_data['risk_level'] in ['yellow', 'red', 'critical']:
            patient_message = self._format_patient_alert(patient, risk_data)
            alert_record['patient_id'] = patient_id
            
            # In-app notification (PRIMARY)
            await self._save_in_app_notification(patient_id, patient_message['in_app'])
            print(f"✅ In-app notification sent to patient")
            
            # Email (gentle)
            await self._send_email(
                patient['email'],
                patient_message['subject'],
                patient_message['email_html']
            )
            print(f"✅ Email sent to patient")
        
        # 3. Send to Family (reassuring)
        if family and risk_data['risk_level'] in ['yellow', 'red', 'critical']:
            family_message = self._format_family_alert(patient, risk_data)
            alert_record['family_id'] = family['_id']
            
            # In-app notification
            await self._save_in_app_notification(family['_id'], family_message['in_app'])
            
            # Email
            await self._send_email(
                family['email'],
                family_message['subject'],
                family_message['email_html']
            )
            print(f"✅ Email sent to family")
        
        # Save alert to MongoDB
        await self.db.alerts.insert_one(alert_record)
        
        # Log in audit trail
        await self.db.audit_logs.insert_one({
            'alert_id': alert_record['_id'],
            'patient_id': patient_id,
            'doctor_id': doctor['_id'] if doctor else None,
            'timestamp': datetime.utcnow().isoformat(),
            'action': 'alert_triggered',
            'risk_score': risk_data['risk_score']
        })
    
    def _format_doctor_alert(self, patient: Dict, risk_data: Dict) -> Dict:
        """Format alert for doctor (clinical, urgent)"""
        return {
            'sms': f"⚠️ ALERT: {patient['name']} (#{patient['_id'][:6]}). "\
                   f"Risk: {risk_data['risk_score']}% ({risk_data['risk_level'].upper()}). "\
                   f"Top factors: {', '.join(risk_data['factors'][:2])}. "\
                   f"Check app for details.",
            
            'subject': f"🚨 SEPSIS ALERT - {patient['name']} Risk Score: {risk_data['risk_score']}%",
            
            'email_html': f"""
<h2>⚠️ Sepsis Risk Alert</h2>
<p><strong>Patient:</strong> {patient['name']} (ID: {patient['_id']})</p>
<p><strong>Risk Level:</strong> <span style="color: #d32f2f; font-weight: bold;">{risk_data['risk_level'].upper()}</span></p>
<p><strong>Risk Score:</strong> {risk_data['risk_score']}%</p>

<h3>Top Risk Factors:</h3>
<ul>
{chr(10).join(f'<li>{factor}</li>' for factor in risk_data['factors'])}
</ul>

<h3>Clinical Assessment:</h3>
<p>{risk_data['explanation']}</p>

<p><strong>Recommendation:</strong> Review vitals and consider early intervention protocol.</p>
<p><a href="http://localhost:3000/dashboard">View Full Details</a></p>
            """,
            
            'in_app': {
                'title': f"Alert: {patient['name']}",
                'message': f"Risk score: {risk_data['risk_score']}%. {risk_data['factors'][0]}",
                'type': risk_data['risk_level'],
                'urgent': True
            }
        }
    
    def _format_patient_alert(self, patient: Dict, risk_data: Dict) -> Dict:
        """Format alert for patient (calm, reassuring)"""
        return {
            'subject': "Your Care Team Has Been Notified",
            
            'email_html': f"""
<h2>💙 Health Update</h2>
<p>Hi {patient['name']},</p>

<p>Your care team has noticed a small change in your vitals and has been notified. 
They are monitoring you closely and will take action if needed.</p>

<p><strong>No action is needed from you right now.</strong> 
Just rest and let your medical team do what they do best.</p>

<p>If you have questions, please contact your care team or use the message feature in your app.</p>

<p>Take care,<br>
The SepsisGuard Team</p>
            """,
            
            'in_app': {
                'title': "Care Team Update",
                'message': "Your care team is monitoring a small change in your vitals. No action needed.",
                'type': 'info',
                'urgent': False
            }
        }
    
    def _format_family_alert(self, patient: Dict, risk_data: Dict) -> Dict:
        """Format alert for family (reassuring, no scary language)"""
        return {
            'subject': f"Update: {patient['name']}'s Health Status",
            
            'email_html': f"""
<h2>💙 Health Update for {patient['name']}</h2>

<p>The medical team has noticed a minor change in {patient['name']}'s vitals and is closely monitoring the situation.</p>

<p>The care team is fully aware and taking all necessary steps to ensure {patient['name']}'s wellbeing.</p>

<p><strong>What's being done:</strong></p>
<ul>
<li>Continuous monitoring of all vital signs</li>
<li>Clinical team is alert and responsive</li>
<li>Updates will be provided as needed</li>
</ul>

<p>We'll keep you informed. If you need to speak with the care team, 
you can request a call through the app.</p>

<p>Warmly,<br>
The SepsisGuard Team</p>
            """,
            
            'in_app': {
                'title': "Update: Monitoring",
                'message': f"{patient['name']}'s care team is monitoring a minor change. Medical team is engaged.",
                'type': 'update',
                'urgent': False
            }
        }
    
    async def _send_sms(self, phone: str, message: str):
        """Send SMS via Twilio"""
        try:
            self.twilio_client.messages.create(
                to=phone,
                from_=self.from_phone,
                body=message
            )
        except Exception as e:
            print(f"SMS Error: {e}")
    
    async def _send_email(self, recipient: str, subject: str, html_content: str):
        """Send Email via SendGrid"""
        try:
            sg_email = Mail(
                from_email=Email("alerts@sepsisguard.health"),
                to_emails=To(recipient),
                subject=Subject(subject),
                html_content=html_content
            )
            self.sg.send(sg_email)
        except Exception as e:
            print(f"Email Error: {e}")
    
    async def _save_in_app_notification(self, user_id: str, notification: Dict):
        """Save in-app notification to database"""
        try:
            await self.db.notifications.insert_one({
                'user_id': user_id,
                'timestamp': datetime.utcnow().isoformat(),
                'read': False,
                **notification
            })
        except Exception as e:
            print(f"Notification Error: {e}")
