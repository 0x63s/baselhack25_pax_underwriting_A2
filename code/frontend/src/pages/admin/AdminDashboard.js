import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { offeringApi, questionApi, clientApi, submissionApi } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    offerings: 0,
    questions: 0,
    clients: 0,
    submissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [offeringsRes, questionsRes, clientsRes] = await Promise.all([
        offeringApi.getAllOfferings(),
        questionApi.getAllQuestions(),
        clientApi.getAllClients(),
      ]);

      setStats({
        offerings: offeringsRes.data.length,
        questions: questionsRes.data.length,
        clients: clientsRes.data.length,
        submissions: 0, // We'll need to sum up submissions per client
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div className={`stat-card stat-card-${color}`} onClick={onClick}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your underwriting system</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Offerings"
          value={stats.offerings}
          icon="📦"
          color="blue"
          onClick={() => navigate('/admin/offerings')}
        />
        <StatCard
          title="Questions"
          value={stats.questions}
          icon="❓"
          color="green"
          onClick={() => navigate('/admin/questions')}
        />
        <StatCard
          title="Clients"
          value={stats.clients}
          icon="👥"
          color="purple"
          onClick={() => navigate('/admin/clients')}
        />
        <StatCard
          title="Submissions"
          value={stats.submissions}
          icon="📝"
          color="orange"
          onClick={() => navigate('/admin/submissions')}
        />
      </div>

      <div className="quick-actions">
        <Card title="Quick Actions">
          <div className="action-buttons">
            <Button onClick={() => navigate('/admin/offerings/new')}>
              Create New Offering
            </Button>
            <Button variant="success" onClick={() => navigate('/admin/questions/new')}>
              Add Question
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/clients')}>
              View All Clients
            </Button>
            <Button variant="secondary" onClick={() => navigate('/user')}>
              User View
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
