import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Sidebar from './components/Navigation/Sidebar';
import TopBar from './components/Navigation/TopBar';
import EventTimerList from './components/EventTimers/EventTimerList';
import ItemDatabase from './components/Items/ItemDatabase';
import NeededItems from './components/NeededItems/NeededItems';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <Router>
          <div className="app">
            <TopBar />
            <div className="app-body">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<EventTimerList />} />
                  <Route path="/database" element={<ItemDatabase />} />
                  <Route path="/needed-items" element={<NeededItems />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </DataProvider>
    </SettingsProvider>
  );
}

export default App;
