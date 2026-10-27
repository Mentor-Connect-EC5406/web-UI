import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ContentLayout } from '@/layouts/ContentLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageErrorPage } from '@/pages/system/StatusPages';
import { RedirectIfSignedIn } from '@/app/RedirectIfSignedIn';
import { paths } from '@/app/paths';

const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const MentorsPage = lazy(() => import('@/pages/public/MentorsPage'));
const MentorProfilePage = lazy(() => import('@/pages/public/MentorProfilePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const OnboardingPage = lazy(() => import('@/pages/auth/OnboardingPage'));

// marketing site and public mentor discovery
export const publicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    {
      // page errors keep the navbar and footer visible
      errorElement: <PageErrorPage />,
      children: [
        { index: true, element: <LandingPage /> },
        {
          element: <ContentLayout />,
          children: [
            { path: paths.mentors, element: <MentorsPage profilePath={paths.mentor} /> },
            { path: paths.mentor(':id'), element: <MentorProfilePage backPath={paths.mentors} /> },
          ],
        },
      ],
    },
  ],
};

// login, sign up and the role choice step after sign up
export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      // already signed in users are redirected to their dashboard
      element: <RedirectIfSignedIn />,
      children: [
        { path: paths.login, element: <LoginPage /> },
        { path: paths.signup, element: <SignupPage /> },
      ],
    },
    { path: paths.onboarding, element: <OnboardingPage /> },
  ],
};
