import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import './BasicLayout.css';

const { Sider } = Layout;

class BasicLayout extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { location } = this.props;

    return (
      <Layout style={{ height: '100vh' }}>
        <Sider
          trigger={null}
          collapsed={this.state.collapsed}
        >
          <div className="logo_wrapper">
            {/*<div className="logo" />*/}
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
            <Menu.Item key="/">
              <NavLink to="/" className="nav-text">
                <Icon type="home" />
                <span>홈</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/project">
              <NavLink to="/project" className="nav-text">
                <Icon type="project" />
                <span>프로젝트 관리</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          {this.props.children}
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(BasicLayout);
