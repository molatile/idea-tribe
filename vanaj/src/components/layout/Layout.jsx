import Navbar from './Navbar';
import Footer from './Footer';
import VoiceAssistant from '../navigation/VoiceAssistant';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-vanaj-cream text-vanaj-dark font-body">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Layout;
