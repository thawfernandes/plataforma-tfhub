import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import { PrivateRoute } from './PrivateRoute';

// Lazy loading views for high performance
import HomeView from '../modules/institutional/views/HomeView';
import ProductsListView from '../modules/products/views/ProductsListView';
import CartView from '../modules/products/views/CartView';
import ServicesListView from '../modules/services/views/ServicesListView';
import ContentHubView from '../modules/content/views/ContentHubView';
import PortfolioListView from '../modules/portfolio/views/PortfolioListView';
import RecognitionsView from '../modules/certificates/views/RecognitionsView';
import LoginView from '../modules/client/views/LoginView';
import ClientDashboardView from '../modules/client/views/ClientDashboardView';
import AdminDashboardView from '../modules/admin/views/AdminDashboardView';
import ProductDetailView from '../modules/products/views/ProductDetailView';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeView />} />
        <Route path="produtos" element={<ProductsListView />} />
        <Route path="produtos/:slug" element={<ProductDetailView />} />
        <Route path="carrinho" element={<CartView />} />
        <Route path="servicos" element={<ServicesListView />} />
        <Route path="conteudo" element={<ContentHubView />} />
        <Route path="portfolio" element={<PortfolioListView />} />
        <Route path="certificados" element={<RecognitionsView />} />
        <Route path="login" element={<LoginView />} />
      </Route>

      {/* Protected Client Area */}
      <Route path="/cliente" element={<MainLayout />}>
        <Route index element={
          <PrivateRoute requiredRole="client">
            <ClientDashboardView />
          </PrivateRoute>
        } />
      </Route>

      {/* Protected Admin Panel */}
      <Route path="/admin" element={
        <PrivateRoute requiredRole="admin">
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboardView />} />
        <Route path="produtos" element={<AdminDashboardView />} />
        <Route path="pedidos" element={<AdminDashboardView />} />
        <Route path="servicos" element={<AdminDashboardView />} />
        <Route path="conteudo" element={<AdminDashboardView />} />
        <Route path="portfolio" element={<AdminDashboardView />} />
        <Route path="equipe" element={<AdminDashboardView />} />
        <Route path="certificados" element={<AdminDashboardView />} />
        <Route path="depoimentos" element={<AdminDashboardView />} />
        <Route path="faq" element={<AdminDashboardView />} />
        <Route path="configuracoes" element={<AdminDashboardView />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
