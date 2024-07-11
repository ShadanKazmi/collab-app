import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './api/AuthContext';
import { TeamProvider } from './api/TeamsContext';
import { MessageProvider } from './api/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TeamProvider>
          <MessageProvider>
            <App />
            </MessageProvider>          
        </TeamProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
