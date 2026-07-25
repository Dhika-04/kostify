import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  WalletCards,
  Building2,
} from 'lucide-react';

function Sidebar() {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Kamar',
      path: '/rooms',
      icon: BedDouble,
    },
    {
      name: 'Penghuni',
      path: '/tenants',
      icon: Users,
    },
    {
      name: 'Pembayaran',
      path: '/payments',
      icon: WalletCards,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>

        <div>
          <h2>Kostify</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p>Kostify</p>
        <span>Final Project</span>
      </div>
    </aside>
  );
}

export default Sidebar;