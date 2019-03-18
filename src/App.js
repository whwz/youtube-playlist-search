import React, { Component } from "react";
import { MDBBtn } from "mdbreact";
import "./index.css";
import { tokens } from "./tokens";

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
 
    submitForm = (e) => {
      e.preventDefault();

      this.setState({playlists: []});
      fetch("https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&channelId=" + this.input.value + "&part=snippet,contentDetails&maxResults=50")
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
      this.input.value = '';
    }

    handleClick = (e) => {
      this.setState({vids: []});
      let a = null;
      for(let i = 0; i < this.state.playlists.length; i++) 
      if(this.state.playlists[i]["id"] === e.target["id"]) {
        a = i;
    }
    const arr = [...this.state.playlists];
    arr[a] = {...arr[a], playlistClicked: !arr[a].playlistClicked};
    this.setState({
      playlists: arr
    })

  }
  handlePlaylistClick = (e) => {

    db = [];
    let pages = 0;
    let url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&part=snippet,contentDetails&playlistId=" + e.target.name + "&maxResults=50";
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
          <input type="text" ref={input => this.input = input} />
          <button type="submit" onClick={this.submitForm}>Submit</button>
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
/* 
class Playlists extends Component {
  constructor(props){
    super(props);
    this.state = {
      playlists: [],
      show: false
    }
  } */
    
/* 
  handleClick = (e) => {
    let ids = [...this.state.playlists];
    let index = ids.findIndex(item => item === e.target.id);
    ids[index] = true;
      this.setState({
        playlists: [ ids ]
      })
  } */

/* 
  componentDidMount() {
    
  } */
/* 
  show = () => {
    
  }
  render() {
    const url = "https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&channelId=" + this.props.url + "&part=snippet,contentDetails&maxResults=50";
    return (
      <>
      
      <a href={url}>{url}</a>
      <button onClick={this.show}>show</button>
      {this.state.playlists.map(item => <div key={item.id}  onClick={this.handleClick} >{item.title}</div>)}
      {console.log(this.props)}
    </>
    )
  }
} */
/* 
class PlaylistItems extends Component {


  render(){
    return (
      <>
        
        {console.log(this.state)}
        <p>fasfas {this.props.url}</p>
      </>
    )
  }
}
 */
export default App;
