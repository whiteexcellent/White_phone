import { usePhoneStore } from '../store/phoneStore';
import PhoneApp from '../apps/PhoneApp';
import MessagesApp from '../apps/MessagesApp';
import SettingsApp from '../apps/SettingsApp';
import TwitterApp from '../apps/TwitterApp';
import BankApp from '../apps/BankApp';
import CameraApp from '../apps/CameraApp';
import PhotosApp from '../apps/PhotosApp';
import MailApp from '../apps/MailApp';
import CalendarApp from '../apps/CalendarApp';
import MapsApp from '../apps/MapsApp';
import MusicApp from '../apps/MusicApp';
import NotesApp from '../apps/NotesApp';
import EmergencyApp from '../apps/EmergencyApp';
import { motion, AnimatePresence } from 'framer-motion';

const APP_COMPONENTS: Record<string, React.ComponentType> = {
    phone: PhoneApp,
    messages: MessagesApp,
    settings: SettingsApp,
    twitter: TwitterApp,
    bank: BankApp,
    camera: CameraApp,
    photos: PhotosApp,
    mail: MailApp,
    calendar: CalendarApp,
    maps: MapsApp,
    music: MusicApp,
    notes: NotesApp,
    emergency: EmergencyApp,
};

export default function AppContainer() {
    const { currentApp, closeApp } = usePhoneStore();
    const App = currentApp ? APP_COMPONENTS[currentApp] : null;

    if (!App || !currentApp) return null;

    const isFullscreen = currentApp === 'camera';

    return (
        <motion.div
            layoutId={`app-icon-${currentApp}`} // Matches key in HomeScreen
            initial={{ opacity: 0, borderRadius: 20 }}
            animate={{ opacity: 1, borderRadius: 55 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{
                type: 'spring',
                damping: 25,
                stiffness: 280,
                mass: 0.8
            }}
            className={`absolute inset-0 bg-black z-[100] overflow-hidden ${isFullscreen ? '' : 'pt-0'}`}
        >
            {/* Inner Content Wrapper - Fades in separately to simulate OS opening */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="w-full h-full relative"
            >
                <App />
            </motion.div>

            {/* App Specific Home Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 dark:bg-white/30 rounded-full z-[1000] pressable"
                onClick={closeApp}
            />
        </motion.div>
    );
}
