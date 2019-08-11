import React from 'react';
import cookie from 'js-cookie';
import { Upload, Button, Icon } from 'antd';

class MyUpload extends React.Component {
  state = {
    fileList: [],
  };

  handleChange = info => {
      
      console.log(info)
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  };
  beforeUpload= (file) => {
    console.log('beforeUpload:',file)
    this.setState((state) => ({
      fileList: [...state.fileList, file],
    }));
    // return false;
  }
  render() {
    const props = {
        
        name:'book',
      action: '/book',
      beforeUpload:this.beforeUpload,
      onChange: this.handleChange,
      multiple: true,
      headers:{Authorization:cookie.get('Authorization')}
    };
    return (
      <Upload {...props} >
        <Button>
          <Icon type="upload" /> Upload
        </Button>
      </Upload>
    );
  }
}

export default MyUpload;