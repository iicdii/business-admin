import React, { Component } from 'react';
import { Layout, Table, Skeleton, Row, Col, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

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
      dataIndex: 'id',
      key: 'id',
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

  originProjectDataSource = [];
  originEmployeeDataSource = [];

  async componentDidMount() {
    this.setState({ loading: true });

    const newState = {...cloneDeep(this.state), loading: false};

    // 프로젝트 데이터 가져오기
    let projectData;
    try {
      const res = await axios('/get/project');

      projectData = res.data;
    } catch (err) {
      console.log(err);

      this.setState({ loading: false });
    }

    // 프로젝트 투입 직원 데이터 가져오기
    let employeeData;
    try {
      const res = await axios('/get/participation');

      employeeData = res.data;
    } catch (err) {
      console.log(err);

      this.setState({ loading: false });
    }

    // 프로젝트 데이터 가공해서 state에 넣기
    newState.projectCount = projectData.count;
    newState.projectDataSource = projectData.results.map(item => {
      const {
        project_id,
        project_name,
        start_date,
        end_date,
        ordering_company,
        employee_count
      } = item;

      return {
        key: project_id,
        project_id,
        project_name,
        start_date: moment(start_date).format('YYYY-MM-DD'),
        end_date: end_date ? moment(end_date).format('YYYY-MM-DD') : '',
        ordering_company,
        employee_count
      };
    });

    this.originProjectDataSource = newState.projectDataSource;

    // 투입직원 데이터 가공해서 state에 넣기
    newState.employeeCount = employeeData.count;
    newState.employeeDataSource = employeeData.results.map(item => {
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
        // 한 직원이 여러 프로젝트에 투입될 수 있으므로 두 개의 키를 합침
        id: `${emp_id}${project_id}`,
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

    this.originEmployeeDataSource = newState.employeeDataSource;

    let employeeColumns = newState.employeeColumns
      .find(n => n.key === 'project_name');

    employeeColumns.filters = newState.projectDataSource.map(n => ({
      text: n.project_name,
      value: n.project_id,
    }));

    this.setState(newState);
  }

  // 프로젝트 시작일~종료일 필터링
  handleChange = date => {
    const startDate = date[0];
    const endDate = date[1];

    this.setState({
      employeeDataSource: this.originEmployeeDataSource.filter(employee =>
        moment(employee.start_date).isBetween(startDate, endDate, null, '[]') &&
        moment(employee.end_date).isBetween(startDate, endDate, null, '[]')
      )
    });
  };

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
          <Row gutter={24}>
            <Col span={12} className="title">
              프로젝트 관리
            </Col>
            <Col span={12} className="user">
              admin
            </Col>
          </Row>
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
            <div>
              <div style={{ margin: '10px 0' }}>
                <RangePicker onChange={this.handleChange} />
              </div>
              <Table
                dataSource={employeeDataSource}
                columns={employeeColumns}
                rowKey="id"
              />
            </div>
          }
        </Content>
      </div>
    );
  }
}

export default Project;
