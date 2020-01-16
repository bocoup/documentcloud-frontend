import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/Home';
import App from '@/pages/app/App';
import Viewer from '@/pages/viewer/Viewer';

export const routes = [NotFound, {
  'home': {
    path: '',
    component: Home
  },
  'app': {
    path: '/app',
    component: App
  },
  'viewer': {
    path: '/documents/:id',
    component: Viewer
  },
}];