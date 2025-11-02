import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Loading from '../../components/common/Loading';
import { offeringApi, questionApi, clientApi, applicationApi } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    offerings: 0,
    questions: 0,
    clients: 0,
    applications: 0,
    pendingReviews: 0,
  });

  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    loadStats();
    loadPendingReviews();
  }, []);

  const loadStats = async () => {
    try {
      const [offeringsRes, questionsRes, clientsRes, applicationsRes, unreviewedRes] = await Promise.all([
        offeringApi.getAllOfferings().catch(() => ({ data: [] })),
        questionApi.getAllQuestions().catch(() => ({ data: [] })),
        clientApi.getAllClients().catch(() => ({ data: [] })),
        applicationApi.getAllApplications().catch(() => ({ data: [] })),
        applicationApi.getUnreviewedApplications().catch(() => ({ data: [] })),
      ]);

      setStats({
        offerings: offeringsRes.data.length,
        questions: questionsRes.data.length,
        clients: clientsRes.data.length,
        applications: applicationsRes.data.length,
        pendingReviews: unreviewedRes.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPendingReviews = async () => {
    setPendingLoading(true);
    try {
      const response = await applicationApi.getUnreviewedApplications();
      setPendingApplications(response.data || []);
    } catch (error) {
      console.error('Error loading pending reviews:', error);
      setPendingApplications([]);
    } finally {
      setPendingLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
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
          title="Total Questions"
          value={stats.questions}
          icon="❓"
          color="green"
          onClick={() => navigate('/admin/offerings')}
        />
        <StatCard
          title="Clients"
          value={stats.clients}
          icon="👥"
          color="purple"
          onClick={() => navigate('/admin/clients')}
        />
        <StatCard
          title="Applications"
          value={stats.applications}
          icon="📋"
          color="indigo"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon="⏳"
          color="orange"
          onClick={() => navigate('/admin/applications')}
        />
      </div>

      <div className="quick-actions">
        <Card title="Quick Actions">
          <div className="action-buttons">
            <Button onClick={() => navigate('/admin/offerings')} variant="primary">
              Manage Offerings
            </Button>
            <Button variant="success" onClick={() => navigate('/admin/applications')}>
              Review Applications
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

      <div className="pending-reviews">
        <Card title={`Pending Reviews (${stats.pendingReviews})`}>
          {pendingLoading ? (
            <Loading />
          ) : (
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                {
                  key: 'client',
                  label: 'Client',
                  render: (_, row) => `${row.client?.firstName || ''} ${row.client?.lastName || ''}`.trim() || '—',
                },
                {
                  key: 'offering',
                  label: 'Offering',
                  render: (_, row) => row.offering?.name || '—',
                },
                {
                  key: 'createdAt',
                  label: 'Submitted',
                  render: (val) => formatDate(val),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <Button size="small" onClick={() => navigate(`/admin/applications?id=${row.id}`)}>
                      Review
                    </Button>
                  ),
                },
              ]}
              data={pendingApplications}
              onRowClick={(row) => navigate(`/admin/applications?id=${row.id}`)}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
