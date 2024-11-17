import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ParaphrasingTool from './components/ParaphrasingTool';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-grow p-4 sm:p-6">
        <ParaphrasingTool />
      </main>
      <Footer />
    </div>
  );
}

export default App;