import React, { Component } from "react";
import { MDBBtn } from "mdbreact";
import "./index.css";

class App extends Component {
  
  /* 
   setTimeout( ()=>{for(let i = 0; i < this.state.playlists.length; i++){
     fetch("https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&part=snippet,contentDetails&playlistId=" + this.state.playlists[i].id + "&maxResults=50")
      .then(res => res.json())
      .then(json => {

        for(let j = 0; j < json.items.length; j++)
        {
          if(json.items[j].snippet.title !== "Private video")
          this.setState({ 
            vids: [...this.state.vids, 
                        {id: json.items[j].contentDetails.videoId,

                        title: json.items[j].snippet.title,
                        playlistId: json.items[j].snippet.playlistId}]
                      });
        }
        let pages = Math.ceil(json.pageInfo.totalResults/50);
        let nextToken = '';
        if(pages > 1)
          nextToken = json.nextPageToken;
          for(let k = 1; k < pages; k++)
          {
            fetch("https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&part=snippet,contentDetails&playlistId=" + this.state.playlists[i].id + "&maxResults=50" + "&nextPageToken=" + nextToken)
              .then(res => res.json())
              .then(json => {
                for(let l = 0; l < json.items.length; l++)
                  {
                    if(json.items[l].snippet.title !== "Private video")
                    this.setState({ 
                      vids: [...this.state.vids, 
                                  {id: json.items[l].contentDetails.videoId,
                                  title: json.items[l].snippet.title,
                                  playlistId: json.items[l].snippet.playlistId}]
                                });
                  }
              })
          }
      })
   }
    }, 2000); */

  //delete private vids

  render() {
    /* {console.log(this.state)} */

    return (
      <>
            {/* <input value={this.state.value}></input> */}
            <Playlists />
      </>
    );
  }
}

class Playlists extends Component {
  constructor(props){
    super(props);
    this.state = {
      playlists: []
    }
  }
    componentDidMount() {
      fetch('https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&channelId=UCJqDxJZoOCRMqggQRtRYVjg&part=snippet,contentDetails&maxResults=50')
        .then(res => res.json())
        .then(json =>{
          for(let i = 0; i < json.items.length; i++)
            this.setState({ 
              playlists: [...this.state.playlists, 
                          {id: json.items[i].id,
                          title: json.items[i].snippet.title,
                          itemCount: json.items[i].contentDetails.itemCount}]
                        });
        })
  }

  render() {
    return (
      <>
      {this.state.playlists.map(item => <li key={item.id}><a href={"https://www.youtube.com/playlist?list=" + item.id}>{item.title}</a></li>)}
    </>
    )
  }
}
/* 
class PlaylistItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      vids: []
    }
  }
} */

export default App;
