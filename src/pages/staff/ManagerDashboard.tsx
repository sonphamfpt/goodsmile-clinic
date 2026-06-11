import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Tab Components
import { ManagerOverview } from './manager-tabs/ManagerOverview';
import { ManagerQueue } from './manager-tabs/ManagerQueue';
import { ManagerRevenue } from './manager-tabs/ManagerRevenue';
import { ManagerRbac } from './manager-tabs/ManagerRbac';
import { ManagerSettings } from './manager-tabs/ManagerSettings';

export const ManagerDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const renderTabContent = () => {
    switch (tab) {
      case 'queue':
        return <ManagerQueue />;
      case 'revenue':
        return <ManagerRevenue />;
      case 'rbac':
        return <ManagerRbac />;
      case 'settings':
        return <ManagerSettings />;
      default:
        return <ManagerOverview />;
    }
  };

  return (
    <div className="p-container-padding-desktop">
      {renderTabContent()}
    </div>
  );
};
