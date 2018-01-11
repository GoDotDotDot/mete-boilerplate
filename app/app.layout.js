import React from "react";
import { render } from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeLocale } from 'containers/LanguageProvider/actions';

import { Layout, Menu, Icon,Select } from "antd";
import nav from "./common/nav";
import createBrowserHistory from "history/createBrowserHistory";
// 建议使用BrowserRouter，这里为了配合使用history而采用Router
// BrowserRouter first,here is for history via Router component.
import {Router, Route, Link, NavLink } from "react-router-dom";
import history from './common/history'
import './common/global.scss'

const Option = Select.Option;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);
// import Promise from "es6-promise";
// Promise.polyfill();

const { Header, Sider, Footer, Content } = Layout;

const getDefaultSelectedKeys =(path)=>{
  const flatPath = path.split('/').filter(_=>_)
  return [flatPath.length > 0 ? path : '/']
}
class AppLayout extends React.Component {
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
  languageChangeHandle=(value)=>{
    console.log(`selected ${value}`);
    const {dispatch} = this.props
    dispatch && dispatch(changeLocale(value))
  }
  render() {
    const {pathname} = history.location
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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={getDefaultSelectedKeys(pathname)} defaultOpenKeys={[pathname]} className='menu'>
              {this.getMenuItem(nav)}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0,boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'}} >
            <Select value={this.props.locale} onChange={this.languageChangeHandle} style={{float:'right',transform:'translate(-20px,50%)'}}>
              <Option value="en">English</Option>
              <Option value="zh-cn">简体中文</Option>
            </Select>
            </Header>
            <Content style={{ margin: "24px 16px 0" }}>
              <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
                {this.getRoute(nav)}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Mete Design ©2017 Created By Mete Design Group | More Be Found In <a href="https://github.com/GoDotDotDot/mete-boilerplate">Github</a>
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

const mapStateToProps = (state)=>{
  const locale = state.get('language').get('locale')
  return {locale}
}
// changeLocale
export default connect(mapStateToProps)(AppLayout);
