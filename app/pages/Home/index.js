import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FormattedMessage } from 'react-intl'
import messages from 'messages/home'
// import { createStructuredSelector } from 'reselect'
import homeReducer from "reducers/home";
import saga from "sagas/home";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import { searchUsersGithubRepo ,changeUsername} from "actions/home";
import { Input, Button, List, Spin, Icon } from "antd";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
class HomePage extends Component {
  onSearchClickHandle = () => {
    const { dispatch,name } = this.props;
    dispatch && dispatch(searchUsersGithubRepo(name));
  };
  onInputChangeHandle = e => {
    const {value} = e.target
    const { dispatch } = this.props;
    dispatch && dispatch(changeUsername(value));
  };
  render() {
    const { name,repoData,loading } = this.props;
    
    return (
      <div>
        <Input
          value={name}
          style={{ width: 200, display: "inline-block", marginRight: 20 }}
          onChange={this.onInputChangeHandle}
        />
        <Button type="primary" icon="search" onClick={this.onSearchClickHandle}>
          <FormattedMessage {...messages.search}/>
        </Button>
        <FormattedMessage {...messages.message}>
        {(t)=><div>{t}</div>}
        </FormattedMessage>
        <Spin indicator={antIcon} style={{paddingTop:30,width:'100%'}} spinning={loading}>
        {repoData && 
        <List
          bordered
          dataSource={repoData}
          renderItem={item => (<List.Item> <a target='_blank' href={item.html_url}>{item.full_name}</a> </List.Item>)}
        />}
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const name = state.get('home2').get("name");
  const repoData = state.get('home2').get("repoData");
  const loading = state.get('home2').get("loading");
  // const username = state.get('home').get("username");
  // console.log('mapStateToProps-username:',username)
  return {name,repoData,loading};
};

const withConnect = connect(mapStateToProps);
const withReducer = injectReducer({ key: "home2", reducer: homeReducer });
const withSaga = injectSaga({ key: 'home2', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage);
