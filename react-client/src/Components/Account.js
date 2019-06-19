import React from 'react';
import { Avatar, Col, Layout, Row, Card } from 'antd';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('currentUser')),
    }
  }
  
  componentDidMount() {
  }

  render() {
    return (
      <div style={{textAlign: "-webkit-center"}}>
        <Layout style={{padding: "36px"}}>
          <Row gutter={{ xs: 10, sm: 18, md: 24, lg: 36 }}>
            <Col xs={24} md={8}>
              <Card style={{backgroundColor: "white", borderColor: "white", borderRadius: "5px"}}>
                <Avatar size="large" style={{marginBottom: "10px"}}>{this.state.user.username[0]}</Avatar>
                <h1>{this.state.user.username}</h1>
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Card style={{backgroundColor: "white", borderColor: "white", borderRadius: "5px"}}>
                Pictures
              </Card>
            </Col>
          </Row>
        </Layout>
      </div>
    );
  }
}

export default Account;
