# **Real-Time Data Visualization Dashboard**

## **Overview**  
This project is a take-home assignment where you will build a real-time web-based application that visualizes streaming data. The application will consist of:

- **A backend server** that receives floating-point data from a TCP stream at **100 samples/sec** (each sample has 10 values, one per channel).
- **A frontend client** that renders this data live on a line chart, displaying the last 30 seconds of data.

Your task is to design and implement a working solution, making decisions around data handling, communication between the client and server, and frontend state management.

*We do not ask you to invest more than **4 hours** in this project. Focus on delivering value, and clearly label the code where you would have done things differently if you had a week to complete the task.*

It's OK to use AI - see [below](#generative-ai).

### **If you have extra time (Optional Enhancements)**  
If time permits, add a **second chart** that displays a **moving average over the past 1 second (100 samples)** for each channel.

---

## **Requirements**  

### Backend
- The backend should receive the incoming data stream.
- It should provide a way for the frontend to access this real-time data efficiently.
- The backend can be implemented in the language you know best. At brain.space we use Python (w/FastAPI), but you can implement with any technology.

### Frontend
- The frontend should display 10 real-time lines on a single chart, with:  
  - **X-axis:** Time  
  - **Y-axis:** Value (one line per channel, 0-9)  
- The chart should update continuously as new data arrives, showing only the **last 30 seconds** of data.
- The frontend should retrieve and manage data from the backend in a performant way.
- The dashboard should ideally be implemented with **React**.

### **Extra Credit (Optional)**  
- Add a **second chart** that displays a **1-second moving average** for each channel.
- Decide where and how to compute the moving average while keeping performance optimal.
- Add any other cool features you think might be nice, either fully implementing them or adding a placeholder and comments.

### <a name="generative-ai"></a>Generative AI

You can use generative AI to help you with the project, but if so, **please share the relevant chats** with a public link or screenshot/download.

---

## **Setup Instructions**  

### **1. Clone the Repository**  
Fork this repository and clone it to your local machine:
```sh
$ git clone https://github.com/YOUR_USERNAME/real-time-dashboard.git
$ cd real-time-dashboard
```

### Run the mock data generator
```sh
node datagen.js
```

You can test the datagen server by running:
```sh
telnet localhost 9000
```

---

## **Deliverables**  
1. Access to forked repository, containing a `README.md` with updated instructions.
1. A **short design document** (can be a markdown file in the repo) covering:
   - Architecture choices (data handling, communication, rendering strategy).
   - Challenges faced and trade-offs made due to time constraints.
   - What you'd improve or do differently with more time.
---

## **Discussion Topics for the Interview**  
After completing the assignment, we’ll discuss:
- **Backend Design:** How did you handle the data stream? How does the backend communicate with the frontend?
- **Frontend Architecture:** How does the frontend manage state and performance while rendering real-time data?
- **Performance Optimizations:** How does the system scale with a higher sampling rate or more channels?
- **Trade-offs & Improvements:** What challenges did you face, and how would you improve the system?

---

## **Next Steps**  
1. Clone the provided repo and set up your development environment.
2. Implement the backend and frontend as described.
3. Submit your forked repository with your code and documentation.

Good luck! 🚀
