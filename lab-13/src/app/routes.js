// Маршрути сайту: масив об'єктів маршрутів React Router, з якого
// App.jsx створює роутер. Сторінки — компоненти в `Component`, тож цей
// файл обходиться без JSX.
import AccountLayout from '../routes/account/AccountLayout.jsx'
import ProfilePage from '../routes/account/ProfilePage.jsx'
import LoginPage from '../routes/login/LoginPage.jsx'
import MoviePage from '../routes/movie/MoviePage.jsx'
import MoviesPage from '../routes/movies/MoviesPage.jsx'
import SchedulePage from '../routes/schedule/SchedulePage.jsx'
import HydrateFallback from '../shared/components/HydrateFallback.jsx'
import NotFoundPage from '../shared/components/NotFoundPage.jsx'
import { guestOnly, requireUser } from './authMiddleware.js'
import RootLayout from './RootLayout.jsx'

export const routes = [
  {
    path: '/',
    Component: RootLayout,
    HydrateFallback,
    children: [
      { index: true, Component: MoviesPage },
      { path: 'movies/:movieId', Component: MoviePage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'login', Component: LoginPage, middleware: [guestOnly] },
      {
        path: 'booking/:sessionId',
        middleware: [requireUser],
        lazy: async () => ({
          Component: (await import('../routes/booking/BookingPage.jsx'))
            .default,
        }),
      },
      {
        path: 'account',
        Component: AccountLayout,
        middleware: [requireUser],
        children: [
          { index: true, Component: ProfilePage },
          {
            path: 'tickets',
            lazy: async () => ({
              Component: (await import('../routes/account/TicketsPage.jsx'))
                .default,
            }),
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
