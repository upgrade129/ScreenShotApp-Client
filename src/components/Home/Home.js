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
import Loader from "react-loader-spinner";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            url : "",
            screenshotType : "DESKTOP",
            imagepath : "",
            DialogBoxOpen : false,
            isurl : true,
            imgname : "",
            isloading : false
        }
        
    }


    handleOnChangeUrl = (e) =>{
      var url = e.target.value;
      var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
      var query = new RegExp(regexQuery,"i");
      if (query.test(url)) {
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
          alert("URL is unsupported ...");
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
                      <DialogContent>
                        <div className="imgcard">
                          <img alt="requested screenshot" className="image" src={this.state.imagepath}/>

                        </div>
                      </DialogContent>
                      <DialogActions>
                        <a  onClick={this.download} className="btndownload" download title="ImageName">
                          <Button variant="contained" color="primary" className="dialogbtn" >Download ScreenShot</Button>
                        </a>                      
                        <Button variant="contained" color="secondary" className="dialogbtn" onClick={this.cancelDialog} >
                          CANCEL

                        </Button>
                      </DialogActions>
                  </Dialog>
                  
              : 
               
               ""}

                <Container className="container" fixed>
                <form className="form">
                <h1>Screenshot App</h1>
                  <TextField id="input" className="formitems" id="url" label="URL" variant="outlined" onChange={this.handleOnChangeUrl} value={this.state.url}/>
                  {!this.state.isurl ? 
                    <span className="span">Give valid URL *</span>
                  :
                    ""}
                  <RadioGroup className="formitems" row aria-label="position" name="position" defaultValue="DESKTOP" onChange={this.handleOnChangeViewport}>
                    <FormControlLabel
                      value="DESKTOP"
                      control={<Radio color="primary" />}
                      label="DESKTOP View"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="TAB"
                      control={<Radio color="primary" />}
                      label="TAB View"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="MOBILE"
                      control={<Radio color="primary" />}
                      label="MOBILE view"
                      labelPlacement="end"
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