import { Navigate, RouteDefinition } from '@solidjs/router'
import Speech from '@/entrypoints/popup/pages/Speech'
import Settings from '@/entrypoints/popup/pages/Settings'

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: () => <Navigate href={'/speech'} />,
  },
  {
    path: '/speech',
    component: Speech,
  },
  {
    path: '/settings',
    component: Settings,
  },
]

export default routes
