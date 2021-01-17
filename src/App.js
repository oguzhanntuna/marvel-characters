import React from 'react';
import './App.scss';

import Layout from './hoc/Layout/Layout';
import LandingPage from './containers/LandingPage/LandingPage';

const app = props => {
  return (
    <div className="App">
      <Layout>
        <LandingPage />
      </Layout>
    </div>
  );
}

export default app;
