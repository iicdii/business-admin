import React, { Component } from 'react';
import { Col, Layout, Row } from 'antd';

const { Header, Content } = Layout;

class Home extends Component {
  render() {
    return (
      <div>
        <Header className="content-header">
          <Row gutter={24}>
            <Col span={12} className="title">
              홈
            </Col>
            <Col span={12} className="user">
              admin
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          홈 화면
        </Content>
      </div>
    );
  }
}

export default Home;
