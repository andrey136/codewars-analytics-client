import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link, withRouter } from 'react-router-dom';
import { userGetAll } from '../_actions/userActions';
import CodewarsChartPulse from '../../codewars/codewarsChartPulse';
import CodewarsChartTrendIcons from '../../codewars/codewarsChartTrendIcons';

const trend = codewarsAnalytics => {
  const lastTwo = codewarsAnalytics.slice(-2);
  return lastTwo[1].data.honor - lastTwo[0].data.honor;
};

class UserList extends Component {
  componentDidMount() {
    this.props.userGetAll();
  }

  getLastCodewarsRecord(el) {
    return el.codewarsAnalytics[el.codewarsAnalytics.length - 1];
  }

  columns() {
    return [
      {
        Header: 'Name',
        id: 'name',
        accessor: el => (
          <span>
            <Link to={`/user/${el._id}`}>
              {this.getLastCodewarsRecord(el).data.username}
            </Link>{' '}
            <strong>{this.getLastCodewarsRecord(el).data.name}</strong>
          </span>
        )
      },
      {
        Header: 'Rank',
        id: 'rank',
        accessor: el => this.getLastCodewarsRecord(el).data.ranks.overall.name
      },
      {
        Header: 'Honor total',
        id: 'honor',
        accessor: el => this.getLastCodewarsRecord(el).data.honor
      },
      {
        Header: 'Tasks total',
        id: 'copmpleted',
        accessor: el => this.getLastCodewarsRecord(el).data.codeChallenges.totalCompleted
      },
      // {
      //   Header: 'Created',
      //   id: 'created',
      //   accessor: el => moment(el.codewarsAnalytics[0].timestamp).format('DD-MMM HH:mm')
      // },
      {
        Header: 'Honor > 20Aug',
        id: 'earned_honor',
        accessor: el =>
          this.getLastCodewarsRecord(el).data.honor - el.codewarsAnalytics[0].data.honor
      },
      {
        Header: 'Tasks > 20Aug',
        id: 'completed_from',
        accessor: el =>
          this.getLastCodewarsRecord(el).data.codeChallenges.totalCompleted -
          el.codewarsAnalytics[0].data.codeChallenges.totalCompleted
      },
      {
        Header: 'Trend (2 days)',
        id: 'trend',
        accessor: el => trend(el.codewarsAnalytics)
      },
      {
        Header: 'Icon',
        id: 'icon',
        accessor: el => (
          <CodewarsChartTrendIcons codewarsAnalytics={el.codewarsAnalytics} />
        )
      },
      {
        Header: 'Pulse (7 days)',
        id: 'pulse',
        accessor: el => <CodewarsChartPulse codewarsAnalytics={el.codewarsAnalytics} />
      }
      // {
      //   Header: 'Updated',
      //   id: 'updated',
      //   accessor: el =>
      //     moment(this.getLastCodewarsRecord(el).timestamp).format('DD-MMM HH:mm')
      // },
    ];
  }

  render() {
    return (
      <div>
        <ReactTable
          className="light border"
          data={this.props.userList}
          columns={this.columns()}
          minRows={this.props.userList.length > 100 ? 100 : this.props.userList.length}
          showPagination={this.props.userList.length > 100}
          defaultPageSize={100}
          defaultSorted={[
            {
              id: 'trend',
              desc: true
            }
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userAuthorizedInfo: state.user.userAuthorizedInfo,
  userList: state.user.userList
});

const mapDispatchToProps = dispatch => ({
  userGetAll: () => dispatch(userGetAll()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserList)
);
