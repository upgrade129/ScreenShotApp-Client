import React, {Component} from 'react';
import '../Home/Home.css';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            url : "",
            screenshotType : "desktop",
            imagepath : "",
            DialogBoxOpen : false
        }
        
    }


    handleOnChangeUrl = (e) =>{
        this.setState({
          url : e.target.value
        })
    }

    handleOnChangeViewport = (e) =>{
        this.setState({
          screenshotType : e.target.value
        })
    }

    submit = () => {
      console.log("url",this.state.url);
      console.log("scType",this.state.screenshotType);
      this.fetchdata();  
      this.setState({
        url : ""
      })
    }

    fetchdata= () =>{
      var url = this.state.url; 
      var screenshotType = this.state.screenshotType;
      axios.get(`https://screenshot-app-server.herokuapp.com//getscreenshot/${url}/${screenshotType}`)
      .then((response) => {
        console.log("path" , response);
        console.log("path url",'https://screenshot-app-server.herokuapp.com/'+response.data);
        this.setState({
          imagepath : 'https://screenshot-app-server.herokuapp.com/'+response.data,
          DialogBoxOpen : true
        })
      })
    }

    handleClickOpen = () => {
      this.setState({
        DialogBoxOpen:true
      });
    };
    handleClose = () => {
      this.setState({
        DialogBoxOpen:false
      });
    };

    download = (e) => {
      fetch(this.state.imagepath, {
        method: "GET",
        headers: {}
      })
        .then(response => {
          response.arrayBuffer().then(function(buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "image.png"); //or any other extension
            document.body.appendChild(link);
            link.click();
          });
        })
        .catch(err => {
          console.log(err);
        });
        this.handleClose();
    };


    render(){
        return(
          <div className="HomePage">
              {this.state.DialogBoxOpen ? 
                    <Dialog className="dialog" onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.DialogBoxOpen}>
                      <div>
                        <img alt="requested screenshot" className="image" src={this.state.imagepath}/>

                      </div>
                      <Button autoFocus color="primary" >
                        <a onClick={this.download} download title="ImageName">
                          Download ScreenShot
                        </a>
                        
                      </Button>
                  </Dialog>
              : 
               
               ""}
                <Container className="container" fixed>
                <form className="form">
                    <h1>Give URL and take Screenshot</h1>
                  <TextField id="input" className="formitems" id="outlined-basic" label="Outlined" variant="outlined" onChange={this.handleOnChangeUrl} value={this.state.url}/>
                  <RadioGroup className="formitems" row aria-label="position" name="position" defaultValue="Desktop" onChange={this.handleOnChangeViewport}>
                    <FormControlLabel
                      value="Desktop"
                      control={<Radio color="primary" />}
                      label="Desktop View"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      value="Tab"
                      control={<Radio color="primary" />}
                      label="Tab View"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      value="Mobile"
                      control={<Radio color="primary" />}
                      label="Mobile view"
                      labelPlacement="top"
                    />
                  </RadioGroup>
                  <Button onClick={this.submit} className="formitems" variant="contained" color="secondary">
                    Get Screenshot
                  </Button>
                </form>
                </Container>
            </div>
        );
    }

}
export default Home;