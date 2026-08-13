'use client';

import React, { useState } from 'react';
import AuthHeader from './AuthHeader';
import TabSwitcher from './TabSwitcher';
import OrgSignUpForm from './OrgSignUpForm';
import UserSignUpForm from './UserSignUpForm';
import OrgLoginForm from './OrgLoginForm';
import UserLoginForm from './UserLoginForm';

export default function AuthContainer() {
  const [activeTab, setActiveTab] = useState('org_signup');

  const subtitles = {
    org_signup: "Register a new organization and admin account",
    user_signup: "Register a new team member under an existing organization",
    org_login: "Sign in as Organization Admin",
    user_login: "Sign in as Organization Member"
  };

  return (
    <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
      {/* Auth Header */}
      <AuthHeader subtitle={subtitles[activeTab]} />

      {/* Tab Switcher (4 Modes) */}
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dynamic Form Content */}
      <div className="mt-2">
        {activeTab === 'org_signup' && (
          <OrgSignUpForm onSubmitSuccess={() => setActiveTab('org_login')} />
        )}
        {activeTab === 'user_signup' && (
          <UserSignUpForm onSubmitSuccess={() => setActiveTab('user_login')} />
        )}
        {activeTab === 'org_login' && (
          <OrgLoginForm />
        )}
        {activeTab === 'user_login' && (
          <UserLoginForm />
        )}
      </div>

      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-400">
        CognoDB Graph Authentication System • bolt+s://db-797445ed.databases.cognodb.com
      </div>
    </div>
  );
}
