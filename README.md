# AI-Based Rockfall Management System for Open-Pit Mines

## Live Demo

🔗 Frontend: https://rockfall-frontend.onrender.com

🔗 Backend API: https://rockfall-backend-7qfn.onrender.com

## Test Credentials

Username: kavin

## Project Overview


The AI-Based Rockfall Management System is designed to enhance safety and operational efficiency in open-pit mining environments by providing real-time monitoring, risk assessment, and predictive analysis of potential rockfall events. Rockfalls pose a significant threat to workers, equipment, and mining operations, often resulting in accidents, production delays, and financial losses. This project leverages IoT sensors, cloud computing, and machine learning techniques to continuously monitor mine slope conditions and identify early warning signs of instability.

The system collects data from various sensors, including vibration sensors, tilt sensors, moisture sensors, rainfall sensors, and crack monitoring devices installed across critical sections of the mine. These sensor readings are transmitted through a communication gateway to a centralized server where the data is stored, processed, and analyzed. Machine learning algorithms evaluate the incoming data and classify slope conditions into Low, Medium, or High-risk categories based on observed patterns and anomalies.

A web-based dashboard provides mine operators and safety personnel with real-time visibility into sensor readings, risk levels, alert notifications, and historical trends. In high-risk situations, the system can trigger automatic alerts through alarms, notifications, or warning messages, enabling timely evacuation and preventive action. The platform also supports historical data analysis, helping engineers understand slope behavior and improve future risk management strategies.


## Problem Statement


Open-pit mines are vulnerable to rockfall incidents caused by geological instability, excessive vibration, rainfall infiltration, slope deformation, and other environmental factors. Traditional monitoring methods rely heavily on manual inspections and periodic assessments, which may fail to detect early warning signs. There is a need for an intelligent, automated system capable of continuously monitoring slope conditions and predicting potential rockfall hazards before they occur.


## Objectives

Monitor mine slope conditions in real time using IoT sensors.
Collect and store environmental and geological data.
Detect abnormal patterns and slope instability indicators.
Classify risk levels as Low, Medium, or High.
Generate timely alerts for hazardous conditions.
Provide a centralized monitoring dashboard.
Support predictive maintenance and safety management.
Reduce accidents, equipment damage, and operational downtime.

## System Modules

1. User Management Module

Handles user authentication, authorization, and role-based access for administrators, engineers, and monitoring personnel.

2. Sensor Data Acquisition Module

Collects real-time data from vibration, tilt, moisture, rainfall, and crack monitoring sensors deployed in mining zones.

3. Data Storage Module

Stores sensor readings, risk assessments, alerts, and historical records in a structured database.

4. AI Prediction Module

Processes collected sensor data using machine learning models to predict potential rockfall events and determine risk levels.

5. Risk Assessment Module

Analyzes sensor trends and classifies mine areas into Low, Medium, or High-risk categories.

6. Alert and Notification Module

Generates warnings and notifications when abnormal conditions are detected.

7. Dashboard and Visualization Module

Provides graphical representations of sensor data, risk maps, alerts, and historical trends.

8. Reporting Module

Generates reports for analysis, auditing, and safety compliance purposes.


## Use Cases

User Login and Authentication
Monitor Live Sensor Data
View Risk Assessment Results
Receive Alert Notifications
Manage Sensor Information
Analyze Historical Data
Generate Reports
Manage Users and Roles
Database Design


The system database consists of the following tables:


Users
Roles
Sensors
Sensor_Readings
Mine_Locations
Risk_Assessments
Alerts
Reports
System_Logs

These tables are connected through an Entity Relationship (ER) model to maintain data integrity and support efficient querying.


User Interface Design


The proposed user interface includes:

Login Page
Dashboard Page
Sensor Monitoring Page
Risk Analysis Page
Alert Management Page
Historical Data Page
Reports Page
User Management Page


The dashboard serves as the primary interface, displaying live sensor readings, current risk levels, active alerts, and analytical charts.

## Frontend

React.js
HTML5
CSS3
JavaScript

## Backend

Python (Flask/FastAPI)
## Database
MySQL
## Machine Learning
Scikit-learn
Random Forest
XGBoost
LSTM (Future Enhancement)
## IoT Hardware
ESP32
Vibration Sensor
Tilt Sensor
Moisture Sensor
Rainfall Sensor
Crack Detection Sensor
## Communication
MQTT Protocol
REST APIs
