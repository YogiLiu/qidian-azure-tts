import { render } from 'solid-js/web'

import './style.css'
import App from './App'
import { MemoryRouter } from '@solidjs/router'
import routes from '@/entrypoints/popup/routes'

render(
  () => <MemoryRouter root={App}>{routes}</MemoryRouter>,
  document.getElementById('root')!,
)
