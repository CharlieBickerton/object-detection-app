import React from 'react';
import { Avatar, Col, Layout, Row, Card } from 'antd';
import Api from '../utils/Api';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('currentUser')),
    }
  }
  
  componentDidMount() {
    this.fetchPictureData();
  }

  fetchPictureData = async () => {
    const {data} = await Api.getPredictions(this.state.user._id, this.state.user.token);
    console.log(data)
    this.setState({
      pics: data
    })
    console.log(this.state)
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
                <Row gutter={{ xs: 5, sm: 7, md: 9, lg: 11 }}>
                { this.state.pics ?
                  <div>
                    {this.state.pics.map((pic) => {
                      return (
                        <Col xs={24} md={12} lg={8}>
                          <img style={{width: "100%", height: "auto", padding: "10px"}} src={pic['url']}/>
                        </Col>
                      )
                    })}
                  </div>
                :
                  <div>You have no saved results</div>
                }
                </Row>
              </Card>
            </Col>
          </Row>
        </Layout>
      </div>
    );
  }
}

export default Account;
