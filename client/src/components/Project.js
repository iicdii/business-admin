import React, { Component } from 'react';
import { Layout, Table, Skeleton } from 'antd';
import axios from 'axios';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

const { Header, Content } = Layout;

class Project extends Component {
  state = {
    loading: false,
    projectCount: 0,
    employeeCount: 0,
    projectDataSource: [],
    projectColumns: [{
      title: 'id',
      dataIndex: 'project_id',
      key: 'project_id',
    }, {
      title: '프로젝트명',
      dataIndex: 'project_name',
      key: 'project_name',
    }, {
      title: '프로젝트 시작일',
      dataIndex: 'start_date',
      key: 'start_date',
    }, {
      title: '프로젝트 종료일',
      dataIndex: 'end_date',
      key: 'end_date',
    }, {
      title: '발주처',
      dataIndex: 'ordering_company',
      key: 'ordering_company',
    }, {
      title: '투입직원 수',
      dataIndex: 'employee_count',
      key: 'employee_count'
    }],
    employeeDataSource: [],
    employeeColumns: [{
      title: 'id',
      dataIndex: 'emp_id',
      key: 'emp_id',
    }, {
      title: '직원명',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '프로젝트명',
      dataIndex: 'project_name',
      key: 'project_name',
      onFilter: (record, value) => `${record}` === `${value.project_id}`,
    }, {
      title: '프로젝트 투입일',
      dataIndex: 'start_date',
      key: 'start_date',
    }, {
      title: '프로젝트 종료일',
      dataIndex: 'end_date',
      key: 'end_date',
    }, {
      title: '직무',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '경력',
      dataIndex: 'career',
      key: 'career'
    }, {
      title: '경험 기술',
      dataIndex: 'skill',
      key: 'skill'
    }],
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const newState = {...cloneDeep(this.state), loading: false};

    try {
      const res = await axios('/get/project');

      const { count, results = [] } = res.data;

      newState.projectCount = count;
      newState.projectDataSource = results.map(item => {
        const {
          project_id,
          project_name,
          start_date,
          end_date,
          ordering_company
        } = item;

        return {
          key: project_id,
          project_id,
          project_name,
          start_date: moment(start_date).format('YYYY-MM-DD'),
          end_date: end_date ? moment(end_date).format('YYYY-MM-DD') : '',
          ordering_company
        };
      });
    } catch (err) {
      console.log(err);

      this.setState({ loading: false });
    }

    try {
      const res = await axios('/get/participation');

      const { count, results = [] } = res.data;

      newState.employeeCount = count;
      newState.employeeDataSource = results.map(item => {
        const {
          project_id,
          emp_id,
          name,
          start_date,
          end_date,
          job,
          career,
          skill
        } = item;

        const { project_name } = newState.projectDataSource
          .find(n => n.project_id === project_id) || {};

        return {
          emp_id,
          project_id,
          project_name,
          name,
          start_date: moment(start_date).format('YYYY-MM-DD'),
          end_date: end_date ? moment(end_date).format('YYYY-MM-DD') : '',
          job,
          career,
          skill
        };
      });

      let employeeColumns = newState.employeeColumns
        .find(n => n.key === 'project_name');

      employeeColumns.filters = newState.projectDataSource.map(n => ({
        text: n.project_name,
        value: n.project_id,
      }));
    } catch (err) {
      console.log(err);

      this.setState({ loading: false });
    }

    this.setState(newState);
  }

  render() {
    const {
      loading,
      projectDataSource,
      projectColumns,
      projectCount,
      employeeDataSource,
      employeeColumns,
      employeeCount,
    } = this.state;

    return (
      <div>
        <Header className="content-header">
          프로젝트 관리
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <h4>총 {projectCount}개의 프로젝트가 있습니다.</h4>
          {loading ?
            <Skeleton /> :
            <Table
              dataSource={projectDataSource}
              columns={projectColumns}
              rowKey="project_id"
            />
          }
          <h4>총 {employeeCount}명의 투입된 직원이 있습니다.</h4>
          {loading ?
            <Skeleton /> :
            <Table
              dataSource={employeeDataSource}
              columns={employeeColumns}
              rowKey="emp_id"
            />
          }
        </Content>
      </div>
    );
  }
}

export default Project;
