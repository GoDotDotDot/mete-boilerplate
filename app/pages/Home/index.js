import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
// import { createStructuredSelector } from 'reselect'
import homeReducer from "reducers/home";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import { searchUsersGithubRepo ,changeUsername} from "actions/home";
import { Input, Button } from "antd";
class HomePage extends Component {
  onSearchClickHandle = () => {
    const { dispatch } = this.props;
    dispatch && dispatch(searchUsersGithubRepo());
  };
  onInputChangeHandle = e => {
    console.log('input typed:',e.target.value);
    const {value} = e.target
    const { dispatch } = this.props;
    dispatch && dispatch(changeUsername(value));
  };
  render() {
    const { name } = this.props;
    console.log('home page:',name)
    return (
      <div>
        <Input
          value={name}
          style={{ width: 200, display: "inline-block", marginRight: 20 }}
          onChange={this.onInputChangeHandle}
        />
        <Button type="primary" icon="search" onClick={this.onSearchClickHandle}>
          Search
        </Button>
        <div>search user's github repo with the input value you typed by click search button.</div>
      </div>
    );
  }
}

// const mapDispatchToProps = () => {}
const mapStateToProps = state => {
  const name = state.get("name");
  console.log('mapStateToProps:',state)
  return { name };
};

const withConnect = connect(mapStateToProps);
const withReducer = injectReducer({ key: "home", reducer: homeReducer });
// const withSaga = injectSaga({ key: 'home', saga })

export default compose(
  withReducer,
  // withSaga,
  withConnect
)(HomePage);
