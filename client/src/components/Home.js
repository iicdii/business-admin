import React, { Component } from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

class Home extends Component {
  render() {
    return (
      <div>
        <Header style={{ background: '#fff' }}>
          홈
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          It's Home!
        </Content>
      </div>
    );
  }
}

export default Home;
