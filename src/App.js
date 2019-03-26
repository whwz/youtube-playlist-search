import React, { Component } from "react";
import { MDBBtn } from "mdbreact";
import "./index.css";
import { tokens, API_KEY } from "./env";

let db = [];
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: '',
      playlists: [],
      vids: db
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
      }), 2000);
      this.inputName.value = '';
    }

    handleClick = (e) => {
      this.setState({vids: []});
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
              }), 200); 
        });

      } else {
        this.setState({
          vids: db
        });
      }

    });
  }


  
  handlePlaylistChange = () => {
    console.log("playlist change");
  }
  render() {
    /* {console.log(this.state)} */

    return (
      <>
        <form>
          <input type="text" placeholder="Channel's ID" ref={input => this.inputId = input} />
          <button type="submit" onClick={this.submitFormId}>Go</button>
        </form>
        <form>
          <input type="text" placeholder="Channel's name" ref={input => this.inputName = input} />
          <button type="submit" onClick={this.submitFormName}>Go</button>
        </form>
            {/* 
            <Playlists url={this.state.currentUser} /> */}
        {this.state.playlists.map((item, i) => item.playlistClicked ? 
        <div key={"div" + item.id}>
          <div id={item.id} key={i} onClick={this.handleClick}>{item.title}</div>
          <input type="search" key={"s" + item.id} name={item.id} onClick={this.handlePlaylistClick} onInput={this.handlePlaylistChange} placeholder={"Search " + item.title + " playlist"} />
          {this.state.vids.length ? this.state.vids./* slice(0, 10). */map((el, index) => <><li key={index}>{el.title}</li></>) : null}
        </div>
        : 
        <div id={item.id} key={item.id} onClick={this.handleClick}>{item.title}</div>)}
      </>
    );
  }
}
export default App;
