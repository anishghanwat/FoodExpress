import { Link } from 'react-router';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export function NotImplemented({ role }) {
  const roleDescriptions = {
    owner: {
      title: 'Restaurant Owner Dashboard',
      features: [
        'Manage restaurant profile and menu items',
        'View and process incoming orders',
        'Track restaurant analytics and revenue',
        'Manage operating hours and availability',
        'View customer reviews and ratings'
      ]
    },
    agent: {
      title: 'Delivery Agent Dashboard',
      features: [
        'View available delivery assignments',
        'Accept and manage active deliveries',
        'Navigate to pickup and delivery locations',
        'Update delivery status in real-time',
        'Track earnings and delivery history'
      ]
    },
    admin: {
      title: 'Admin Dashboard',
      features: [
        'Manage users (customers, owners, agents)',
        'Monitor platform-wide analytics',
        'Handle disputes and support tickets',
        'Manage restaurant approvals',
        'Configure platform settings'
      ]
    }
  };

  const config = roleDescriptions[role] || roleDescriptions.owner;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction size={40} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#1F2937] mb-3">
            {config.title}
          </h1>
          
          <p className="text-[#6B7280] mb-8">
            This section is currently under development. Here's what will be available:
          </p>

          <div className="bg-[#F9FAFB] rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-[#1F2937] mb-4">Planned Features:</h3>
            <ul className="space-y-2">
              {config.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-[#6B7280]">
                  <span className="text-[#10B981] mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/restaurants">
              <Button variant="primary" className="gap-2">
                <ArrowLeft size={18} />
                Back to Customer View
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">
                Switch Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
