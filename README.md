# 🤖 iLyn – Your Personal Virtual Assistant

**iLyn** is a full-stack virtual assistant application developed as part of my *Trabajo de Fin de Ciclo* (TFC) for the *Desarrollo de Aplicaciones Web* (DAW) CFGS program. The project integrates modern web technologies with Natural Language Processing (NLP) to provide users with an interactive assistant capable of understanding and responding to natural language queries.

---

## 🧠 Key Features

- **Natural Language Processing**: Utilizes Python-based NLP to interpret and process user inputs effectively.
- **Interactive Chat Interface**: Built with React, offering a responsive and user-friendly frontend experience.
- **Robust Backend**: Powered by Node.js, handling API requests and managing data flow between the frontend and NLP engine.
- **Modular Architecture**: Clean separation between client, server, and NLP components for maintainability and scalability.

---

## 🛠️ Technologies Used

- **Frontend**: React
- **Backend**: Node.js
- **NLP Engine**: Python
- **Database**: MySQL

---

## 📁 Project Structure

```
iLyn/
├── client/         # React frontend
├── server/         # Node.js backend
├── nlp/            # Python NLP scripts
├── iLyn.sql        # Database schema
├── package.json    # Project metadata and scripts
└── README.md       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- Python 3.x installed
- [Specify any other requirements, e.g., virtual environment, database setup]

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Z4k3n/iLyn.git
   cd iLyn
   ```

2. **Install frontend dependencies**:

   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**:

   ```bash
   cd ../server
   npm install
   ```

4. **Set up the NLP environment**:

   ```bash
   cd ../nlp
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**:

   ```bash
   cd server
   npm start
   ```

2. **Start the frontend application**:

   ```bash
   cd ../client
   npm start
   ```

3. **Run the NLP engine**:

   ```bash
   cd ../nlp
   python main.py
   ```

*Ensure all components are running concurrently for full functionality.*

---

## 📜 License

This project is licensed under the [Apache-2.0 License](LICENSE).

---

## 🙌 Acknowledgments

- Developed as part of the final project for the DAW CFGS program.
- Special thanks to IES CAMP de MORVEDRE, where I studied for the teachings.
