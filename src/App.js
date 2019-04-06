import React, { Component } from "react";
import { MDBListGroup, MDBListGroupItem, MDBBtn, MDBContainer, MDBBadge, MDBInput, MDBCol, MDBRow,  MDBFormInline, MDBIcon, MDBAnimation } from "mdbreact";
import "./index.css";
import { tokens, API_KEY } from "./env";
import './App.css';

let db = [];
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: '',
      playlists: [],
      vids: db,
      filteredVids: []
    }
  } 
  /* 
  let url  = "https://www.googleapis.com/youtube/v3/search?part=id&q=" + this.input.value + "&type=channel&key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q";
  let url2 = "https://www.googleapis.com/youtube/v3/channels?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&forUsername=" + this.input.value + "&part=id"; */
    submitFormId = (e, id) => {
      console.log(e.target);
      console.log("https://www.googleapis.com/youtube/v3/playlists?key=" + API_KEY + "&channelId=" + this.inputId.value + "&part=snippet,contentDetails&maxResults=50");
      e.preventDefault();
      this.setState({playlists: []});
      fetch("https://www.googleapis.com/youtube/v3/playlists?key=" + API_KEY + "&channelId=" + this.inputId.value + "&part=snippet,contentDetails&maxResults=50")
      .then(res => res.json())
      .then(json =>{
        for(let i = 0; i < json.items.length; i++)
          this.setState({ 
            currentUser: '',
            playlists: [...this.state.playlists, 
                        {id: json.items[i].id,
                        title: json.items[i].snippet.title,
                        itemCount: json.items[i].contentDetails.itemCount,
                        playlistClicked: false}]
                      });
      });
      this.inputId.value = '';
    }

    submitFormName = (e) => {
      e.preventDefault();
      this.setState({playlists: []});
      let id = '';
      fetch("https://www.googleapis.com/youtube/v3/channels?key=" + API_KEY + "&forUsername=" + this.inputName.value + "&part=id")
      .then(res2 => res2.json())
      .then(json2 =>{
        id = json2.items[0].id;
        console.log(json2);
      });

      setTimeout(()=>fetch("https://www.googleapis.com/youtube/v3/playlists?key=" + API_KEY + "&channelId=" + id + "&part=snippet,contentDetails&maxResults=50")
      .then(res => res.json())
      .then(json =>{
        for(let i = 0; i < json.items.length; i++)
          this.setState({ 
            currentUser: '',
            playlists: [...this.state.playlists, 
                        {id: json.items[i].id,
                        title: json.items[i].snippet.title,
                        itemCount: json.items[i].contentDetails.itemCount,
                        playlistClicked: false}]
                      });
      }), 500);
      this.inputName.value = '';
    }

    handleClick = (e) => {
      this.setState({
        vids: [],
        filteredVids: []
      });
      const arr = [...this.state.playlists]; //store playlists state into array
      for(let i = 0; i < this.state.playlists.length; i++) 
      {
        if(this.state.playlists[i]["id"] === e.target["id"]) //check if playlist from state is the one clicked
        {
          arr[i] = {...arr[i], playlistClicked: !arr[i].playlistClicked}; //toggle clicked playlist (show/hide)
        } else {
          arr[i] = {...arr[i], playlistClicked: false}; //set all non-clicked playlistsClicked value to false (hide)
        }
      }

      this.setState({
        playlists: arr
      });
  }

  handlePlaylistClick = (e) => {
    db = [];
    let pages = 0;
    let url = "https://www.googleapis.com/youtube/v3/playlistItems?key=" + API_KEY + "&part=snippet,contentDetails&playlistId=" + e.target.name + "&maxResults=50";
    fetch(url)
    .then(res => res.json())
    .then(json => {
      //1st page
      for(let j = 0; j < json.items.length; j++)
      {
        if(json.items[j].snippet.title !== "Private video")
                  db.push( 
                    {id: json.items[j].contentDetails.videoId,
                    title: json.items[j].snippet.title,
                    playlistId: json.items[j].snippet.playlistId}
                  );
      }
                
      pages = Math.ceil(json.pageInfo.totalResults/json.pageInfo.resultsPerPage);
      console.log(pages);
      let newUrl = '';
      //1+ pages
      if(pages > 1)
      for(let i = 1; i < pages; i++)
      {
        newUrl = url + "&pageToken=" + tokens[i - 1];
        console.log(newUrl);
        fetch(newUrl)
        .then(nextPageRes => nextPageRes.json())
        .then(nextPageJson => {

          for(let j = 0; j < nextPageJson.items.length; j++)
              {
                if(nextPageJson.items[j].snippet.title !== "Private video")
                db.push( 
                  {id: nextPageJson.items[j].contentDetails.videoId,
                  title: nextPageJson.items[j].snippet.title,
                  playlistId: nextPageJson.items[j].snippet.playlistId}
                );
              }

              setTimeout(()=>this.setState({
                vids: db
              }), 500);
        });

      } else {
        this.setState({
          vids: db
        });
      }

    });
  }

  filterVids = (e) => {
    const text = e.currentTarget.value;
    const filteredVids = this.getFilteredVids(text);
    this.setState({
      filteredVids
    });
  }

  getFilteredVids(text) {
    return this.state.vids.filter( vid => 
      vid.title.toLowerCase().includes(text.toLowerCase()))
  }

  render() {
    /* {console.log(this.state)} */

    return (
      <>
      <MDBContainer className="container">{/* <MDBRow> */}
        {/* <MDBCol md="6"> */}
        <form className="d-flex justify-content-center form">
          <input className="form-control channel" type="text" placeholder="Channel's ID" ref={input => this.inputId = input} />
          <MDBBtn className="button" color="primary" type="submit" onClick={this.submitFormId}>Go</MDBBtn>
        </form>
        <form className="d-flex justify-content-center form">
          <input className="form-control channel" type="text" placeholder="Channel's name" ref={input => this.inputName = input} />
          <MDBBtn className="button" color="primary" type="submit" onClick={this.submitFormName}>Go</MDBBtn>
        </form>
        {/* </MDBCol> */}
      {/* </MDBRow> */}
            {/* 
            <Playlists url={this.state.currentUser} /> */}
      </MDBContainer>
      <MDBContainer className="container">
        <MDBListGroup>
          {this.state.playlists.map((item, i) => item.playlistClicked ? 
          <div key={"div" + item.id}>
            <MDBListGroupItem className="d-flex justify-content-between align-items-center"  color="warning" id={item.id} key={i} onClick={this.handleClick} active>{item.title}<MDBBadge color="primary"
        pill>{item.itemCount}</MDBBadge></MDBListGroupItem>
            <MDBCol>
              <MDBFormInline className="md-form d-flex justify-content-center align-items-center">
                <MDBIcon icon="search" />
                <MDBAnimation type="zoomIn"><input className="form-control form-control-sm ml-3 w-75" type="search" key={"s" + item.id} name={item.id} onClick={this.handlePlaylistClick} onInput={this.filterVids} placeholder={"Search " + item.title + " playlist"} aria-label="Search" /></MDBAnimation>
              </MDBFormInline>
            </MDBCol>
{/*             <input type="search" key={"s" + item.id} name={item.id} onClick={this.handlePlaylistClick} onInput={this.handlePlaylistChange} placeholder={"Search " + item.title + " playlist"} />
 */}            {this.state.vids.length ? this.state.filteredVids./* slice(0, 10). */map((el, index) => <div class="d-flex justify-content-center"><MDBListGroupItem key={index} className="container"><a href={"https://www.youtube.com/watch?v=" + el.id + "&list=" + item.id}>{el.title}</a></MDBListGroupItem></div>) : null}
          </div>
          : 
          <MDBAnimation type="fadeIn" duration="1s"><MDBListGroupItem className="d-flex justify-content-between align-items-center"  color="warning" id={item.id} key={item.id} onClick={this.handleClick} hover>{item.title}<MDBBadge color="primary"
          pill>{item.itemCount}</MDBBadge></MDBListGroupItem></MDBAnimation>)}
        </MDBListGroup>
        </MDBContainer>
      </>
    );
  }
}
export default App;
