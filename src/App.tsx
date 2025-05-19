import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

function App() {
  const { theme, initTheme } = useThemeStore();
  
  useEffect(() => {
    initTheme();
  }, [initTheme]);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;