A professional README.md is the "face" of your project. It tells the recruiter exactly what you built, how to run it, and shows off your technical vocabulary.

Create a new file named README.md in the root of your repository and paste this:
Markdown

# AI-First HCP Interaction CRM & QMS Implementation

This project was developed as part of a 60-hour technical challenge. It features a full-stack AI-driven CRM for Healthcare Professional (HCP) engagement and a conceptual framework for Pharmaceutical Quality Management Systems (QMS).

## 🚀 Project Overview

The system consists of a **FastAPI** backend orchestrating a **LangGraph** agent and a **React-Redux** frontend. The goal is to allow medical representatives to log interactions, check inventory, and schedule follow-ups using natural language.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** FastAPI
* **Orchestration:** LangGraph (Stateful Multi-Actor Agent)
* **LLM:** Llama-3.1-8b-instant (via Groq)
* **Tools:** Custom Python tools for CRM operations

### **Frontend**
* **Library:** React.js (Vite)
* **State Management:** Redux Toolkit
* **Communication:** Axios (with CORS middleware)

---

## 📦 Features & Functionalities

### **Task 1: AI Agentic CRM**
The agent is equipped with **5 specialized tools**:
1.  **Log Interaction:** Records details of meetings with doctors.
2.  **Edit Interaction:** Updates existing records via ID.
3.  **HCP Details:** Retrieves specialty and location data for doctors.
4.  **Product Inventory:** Real-time stock checking for medicine samples.
5.  **Schedule Follow-up:** Sets dates for future medical appointments.

### **Task 2: QMS Concept (Video Presentation)**
A detailed explanation of pharmaceutical quality workflows, including:
* **Deviation Management:** Identifying and documenting batch failures.
* **CAPA:** Corrective and Preventive Actions to ensure product safety.
* **Change Control & Recalls:** Managing structural changes and market withdrawals.

---

## ⚙️ Setup & Installation

### **1. Backend (FastAPI)**
```bash
cd task_1/backend
python -m venv venv
source venv/bin/activate  # On Ubuntu
pip install -r requirements.txt
# Ensure your .env file contains: GROQ_API_KEY=your_key_here
python main.py

2. Frontend (React)
Bash

cd task_1/frontend
npm install
npm start
