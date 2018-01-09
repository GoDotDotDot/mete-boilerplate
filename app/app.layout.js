import React from "react";
import { render } from "react-dom";
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from "antd";
// import Promise from "es6-promise";
import nav from "./common/nav";
import createBrowserHistory from "history/createBrowserHistory";
// 建议使用BrowserRouter
// BrowserRouter first，please
import {Router, Route, Link, NavLink } from "react-router-dom";
import history from './common/history'
import './common/global.scss'

// Promise.polyfill();

const { Header, Sider, Footer, Content } = Layout;

export default class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.hashChangeHandle = this.hashChangeHandle.bind(this)
  }
  state = {
    collapsed: false
  };
  hashChangeHandle(){
    window.scrollTo(0, 0);    
  }
  componentWillMount() {
    // if use HashRouter, the follow code will be uesfull for auto scrolling page to the top of page.
    // window.addEventListener(
    //   "hashchange",
    //   this.hashChangeHandle,
    //   false
    // );
    console.log(history)
    if(history){
      const unlisten = history.listen((location, action) => {
        console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
        console.log(`The last navigation action was ${action}`)
      })
      // unlisten()
    }
  }
  componentWillUnmount(){
    // window.removeEventListener('hashchange',this.hashChangeHandle)
  }
  getRoute = nav => {
    return nav.map(ele => {
      if (ele.child) {
        return this.getRoute(ele.child);
      }
      if (ele.component) {
        return (
          <Route
            key={ele.route}
            exact
            path={ele.route}
            component={ele.component}
          />
        );
      }
    });
  };
  getMenuItem = nav => {
    return nav.map(ele => {
      if (ele.child) {
        return <Menu.SubMenu className='sub-menu' key={ele.route} title={ele.title}>{this.getMenuItem(ele.child)}</Menu.SubMenu>;
      }
      return (
        <Menu.Item key={ele.route}>
          <Link to={ele.route}>{ele.title}</Link>
        </Menu.Item>
      );
    });
  };

  render() {
    return (
      <Router history={history}>
        <Layout style={{height:'100%'}}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            className='cus-sider'
            width={250}
          >
            <div className="logo">
              <h1>METE DESIGN ADMIN</h1> 
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["/"]} className='menu'>
              {this.getMenuItem(nav)}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0,boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'}} />
            <Content style={{ margin: "24px 16px 0" }}>
              <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
                {this.getRoute(nav)}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Mete Design ©2017 Created By Mete Design Group
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}
// AppLayout.contextTypes = {
//   history: PropTypes.any,
//   store:PropTypes.any
// };