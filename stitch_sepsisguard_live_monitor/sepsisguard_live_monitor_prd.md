# 🏥 App Vision: SepsisGuard Live Monitor
> *"One dashboard. Three views. AI watching 10+ signals per patient. Instant alerts when anything shifts."*
---
## 🎯 What You're Building (Simple Summary)
✅ A live health monitoring app with 3 dashboards:
   👨‍⚕️ Doctor View: See all assigned patients + risk alerts
   👤 Patient View: See own vitals + simple health status
   👨‍👩‍👧 Family View: See loved one's status + receive alerts
✅ Backend AI Agent:
   • Monitors 10+ data points per patient (HR, O₂, BP, Temp, RR, lactate, WBC, etc.)
   • Analyzes trends every 60 seconds
   • Flags even slight concerning changes instantly
✅ Smart Alert System:
   • If AI detects a "bad mark" → instant notification to:
     - Doctor (priority alert + clinical details)
     - Patient (calm, simple message)
     - Family (reassuring update + action taken)
---
## 🔁 Simple Data Flow
📡 Patient's Body
     ↓
[Medical Devices / Manual Input]
     ↓
📦 Backend AI Agent (per patient)
     • Collects 10+ signals: HR, O₂, BP, Temp, RR, lactate, WBC, age, history, meds...
     • Checks trends every 60 seconds
     • Compares to personal baseline + sepsis patterns
     ↓
⚠️ If "slight bad mark" detected:
     • Risk score updates (e.g., 12% → 45%)
     • Alert triggered instantly
     ↓
📲 Multi-Channel Notification:
     • Doctor: "⚠️ Patient #42: Early sepsis signal. Lactate ↑, Temp trend +1.1°C. Consider action."
     • Patient: "Your care team has been notified of a small change. They're watching closely."
     • Family: "Update: [Name]'s vitals show a minor change. Medical team is aware and monitoring."
     ↓
🖥️ Dashboards Update in Real-Time:
     • Doctor sees red flag + details
     • Patient/Family see status change + reassurance
---
## 🖥️ Dashboard Views (What Each Person Sees)
### 👨‍⚕️ Doctor Dashboard
📋 Patient List (Assigned to Me)
┌─────────────────────────────────┐
│ ✅ Patient #31 — Low Risk (8%)   │
│ ✅ Patient #42 — ⚠️ Watch (45%)  │ ← Highlighted
│ ✅ Patient #57 — Low Risk (12%)  │
└─────────────────────────────────┘
🔍 Click Patient #42 → Detailed View:
• Live vital charts (last 24h)
• Risk timeline: "Risk rose from 12% → 45% in 90 min"
• Top 3 triggers: "Lactate ↑, Temp trend, RR ↑"
• Quick actions: [Order Labs] [Message Team] [Escalate]

### 👤 Patient Dashboard
❤️ My Health Status
┌─────────────────────┐
│ 🟢 All Stable       │ ← or 🟡 Minor Change
│ Last updated: 2 min │
└─────────────────────┘
📊 My Vitals (Simple View):
• Heart: ❤️ 82 bpm (normal)
• Oxygen: 💨 96% (good)
• Temp: 🌡️ 37.6°C (slight rise)
💬 Message from Care Team:
"We noticed a small change and are monitoring closely. 
No action needed from you right now."

### 👨‍👩‍👧 Family Dashboard
👨‍⚕️ [Patient Name]'s Status
┌─────────────────────┐
│ 🟡 Minor Update     │
│ Care team notified  │
└─────────────────────┘
📬 Recent Updates:
• 2:14 PM: Vitals show slight temp increase — team is aware
• 1:30 PM: All stable ✅
📞 Need to talk to the team? [Request Call]
---
## 🤖 Backend AI Agent (The "Brain")
🔄 Runs Every 60 Seconds Per Patient:
1️⃣ COLLECT
   • 10+ data points: HR, O₂, BP, Temp, RR, lactate, WBC, age, comorbidities, meds, recent procedures...
2️⃣ ANALYZE
   • Compare to patient's own baseline (not just "normal range")
   • Detect trends: "Temp rising 0.3°C/hour", "HR accelerating"
   • Check multi-signal patterns: "HR↑ + Temp↑ + Lactate↑ = early sepsis signal"
3️⃣ SCORE
   • Generate risk % (0–100) + confidence level
   • If risk jumps >15% OR crosses threshold → trigger alert
4️⃣ EXPLAIN
   • Identify top 3 contributing factors
   • Generate plain-language summary for each user type
5️⃣ ALERT
   • Send tailored messages to doctor/patient/family
   • Log event for audit + model improvement
---
## ⚡ Alert Logic: "Slight Bad Mark" Defined
🔔 Alert Triggers (Any ONE of these):
• Risk score increases by ≥15% in 30 minutes
• Any vital crosses clinical threshold (e.g., Temp >38°C, O₂ <94%)
• Multi-signal pattern detected (e.g., HR↑ + Temp↑ + RR↑)
• Key lab result abnormal (e.g., lactate >2.5 mmol/L)
🎯 Alert Tiers:
🟡 Watch (Risk 30–60%): 
   → Doctor: "Monitor closely" 
   → Patient/Family: "Minor change — team is aware"
🔴 Warning (Risk 60–85%): 
   → Doctor: "Consider early intervention" 
   → Patient/Family: "Care team is evaluating"
🚨 Critical (Risk >85%): 
   → Doctor: "Activate protocol NOW" 
   → Patient/Family: "Medical team is taking action"
---
## 🛠️ Hackathon Tech Stack (Fast & Feasible)
| Component | Tool | Why |
|-----------|------|-----|
| **Frontend** | Streamlit or Gradio | Build all 3 dashboards in Python, fast prototyping |
| **Backend** | FastAPI or Flask | Lightweight API for AI agent + alerts |
| **AI Model** | XGBoost (pre-trained) | Fast inference, handles missing data, explainable |
| **Real-Time** | WebSocket or Server-Sent Events | Push alerts instantly without page refresh |
| **Data** | Synthetic generator (pandas) | HIPAA-safe, realistic patient streams |
| **Notifications** | Twilio (SMS) + Email + In-App | Multi-channel alerts for demo |
| **Auth** | Simple role-based (doctor/patient/family) | JWT tokens or session flags |
---
## 🗂️ Simple Project Structure
so a login page for all ,and a quite good and professional dashboard