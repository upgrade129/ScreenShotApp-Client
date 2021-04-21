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
import validator from 'validator';
import Loader from "react-loader-spinner";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            url : "",
            screenshotType : "desktop",
            imagepath : "",
            DialogBoxOpen : false,
            isurl : true,
            imgname : "",
            isloading : false
        }
        
    }


    handleOnChangeUrl = (e) =>{
      if (validator.isURL(e.target.value)) {
        this.setState({
          isurl : true
        });
      } else {
        this.setState({
          isurl : false
        });
      }
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
      if(this.state.isurl){
        this.fetchdata();  
        this.setState({
          isloading : true
        })
      }
      else{
        alert("URL is invalid");
      }

      this.setState({
        url : ""
      })
    }

    fetchdata= () =>{
      var url = this.state.url; 
      var screenshotType = this.state.screenshotType;
      var details = {
        "url" : url,
        "viewport" : screenshotType
      }
      axios.post(`https://screenshot-server-app2.herokuapp.com/`,details)
      .then((response) => {
        console.log("path" , response);
        if(response.data){
          console.log("path url",'https://screenshot-server-app2.herokuapp.com/'+response.data);
          this.setState({
            imgname : response.data,
            imagepath : 'https://screenshot-server-app2.herokuapp.com/'+response.data,
            DialogBoxOpen : true,
            isloading : false
          });
        }
        else{
          alert("Please give the accurate url including HTTPS://...");
          this.setState({
            isloading: false
          })
        }

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

    cancelDialog = () =>{
      this.handleClose();
      this.deletescreenshot();
    }

    deletescreenshot = () =>{
      var details = {
        "name" : this.state.imgname
      }
      axios.post(`https://screenshot-server-app2.herokuapp.com/del`,details)
      .then((response) => {
        console.log("img" , response);    
      })
    }

    download = (e) => {
     this.handleClose();
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
          this.deletescreenshot();
          
        })
        .catch(err => {
          console.log(err);
        });
        this.handleClose();
    };


    render(){
        return(
          
          <div className="HomePage">
            {this.state.isloading ?
                <Dialog className="loader" aria-labelledby="customized-dialog-title" open={this.state.isloading}>
                  <Loader 
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                
                </Dialog>
              
          :
          ""
          }
              {this.state.DialogBoxOpen ? 
                    <Dialog className="dialog" aria-labelledby="customized-dialog-title" open={this.state.DialogBoxOpen}>
            
                      <div className="imgcard">
                        <img alt="requested screenshot" className="image" src={this.state.imagepath}/>

                      </div>
                      <Button fixed autoFocus color="primary" className="dialogbtn" >
                        <a  onClick={this.download} className="btndownload" download title="ImageName">
                          Download ScreenShot
                        </a>
                        
                      </Button>
                      <Button fixed autoFocus color="danger" className="dialogbtn" onClick={this.cancelDialog} >
                        CANCEL
                        
                      </Button>
                  </Dialog>
                  
              : 
               
               ""}
                <Container className="container" fixed>
                <form className="form">
                    <div className="headerimg"></div>
                  <TextField id="input" className="formitems" id="url" label="URL" variant="outlined" onChange={this.handleOnChangeUrl} value={this.state.url}/>
                  {!this.state.isurl ? 
                    <span style={{fontWeight:'bold', color: 'red'}}>Add valid URL *</span>
                  :
                    ""}
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