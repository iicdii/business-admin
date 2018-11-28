import React, { Component } from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

class Project extends Component {
  render() {
    return (
      <div>
        <Header style={{ background: '#fff' }}>
          프로젝트 관리
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          It's Project!
        </Content>
      </div>
    );
  }
}

export default Project;
