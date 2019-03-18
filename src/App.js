import React, { Component } from "react";
import { MDBBtn } from "mdbreact";
import "./index.css";
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
    submitForm = (e) => {
      e.preventDefault();
      /* this.setState({
        currentUser: this.input.value
      });
      console.log(this.input.value); */
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
    /* findWithAttr = (array, attr, value) => {
      for(let i = 0; i < array.length; i++) {
          if(array[i][attr] === value) {
              return i;
          }
      }
      return -1;
    } */
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
/* 
    const a = findWithAttr(this.state.playlists, "id", "PLhI_w4Zkc_omQ5YfMmWOl4ZTfEkwSgtbD"); */
      /* console.log(e.target.id);
      console.log(a);
      console.log(this.state); */
    }
  //delete private vids
 /*  handlePlaylistClick = (e) => {
    console.log("playlist click");
    this.setState({vids: []});
    console.log(e.target.name);
    const url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&part=snippet,contentDetails&playlistId=" + e.target.name + "&maxResults=50";
    fetch(url)
    .then(res => res.json())
    .then(json => {
      for(let i = 0; i < json.items.length; i++)
        {
          if(json.items[i].snippet.title !== "Private video")
          this.setState({ 
            vids: [...this.state.vids, 
                        {id: json.items[i].contentDetails.videoId,
                        title: json.items[i].snippet.title,
                        playlistId: json.items[i].snippet.playlistId}]
                      });
        }

      let pages = Math.ceil(json.pageInfo.totalResults/50);
      
      
      if(pages > 1)
      {
        let nextToken = '';
        nextToken = json.nextPageToken;
        for(let j = 1; j < pages; j++)
        {
          
          
          console.log("j = " + j);
          console.log(url + "&pageToken=" + nextToken);
          fetch(url + "&pageToken=" + nextToken)
            .then(res => res.json())
            .then(json => {
              for(let k = 0; k < json.items.length; k++)
              {
                if(json.items[k].snippet.title !== "Private video")
                this.setState({ 
                  vids: [...this.state.vids, 
                              {id: json.items[k].contentDetails.videoId,
                              title: json.items[k].snippet.title,
                              playlistId: json.items[k].snippet.playlistId}]
                            });
              }
              console.log(json.nextPageToken);
              nextToken = json.nextPageToken;
              console.log("here" + nextToken);
            })
        }
    }
    });
  } */

   

  handlePlaylistClick = (e) => {

    const sleep = (milliseconds) => {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

    /* console.log("playlist click"); */
    //this.setState({vids: []});
    /* console.log(e.target.name); */
    let url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDotJrfVw9QwJVu85Hs91Dh2DYDsvOiw6Q&part=snippet,contentDetails&playlistId=" + e.target.name + "&maxResults=50";
    fetch(url)
    .then(res => res.json())
    .then(json => {
      let pages = Math.ceil(json.pageInfo.totalResults/50);

      if(pages > 1)
      {
        console.log("pages > 1");
        let nextToken = '';
        nextToken = json.nextPageToken;
        
        
        for(let k = 0; k < json.items.length; k++)
        {
          if(json.items[k].snippet.title !== "Private video")
          db.push( 
                    {id: json.items[k].contentDetails.videoId,
                    title: json.items[k].snippet.title,
                    playlistId: json.items[k].snippet.playlistId}
                  );
        }


        let newUrl = url + "&pageToken=" + nextToken;
        for(let j = 1; j < pages; j++)
        {
          (function(j){
            setTimeout(function(){

              console.log("j = " + j);
          console.log("newUrl = " + newUrl);
      
          fetch(newUrl)
            .then(res2 => res2.json2())
            .then(json2 => {
              console.log(json2);
              for(let k = 0; k < json2.items.length; k++)
              {
                if(json2.items[k].snippet.title !== "Private video")
                db.push( 
                  {id: json2.items[k].contentDetails.videoId,
                  title: json2.items[k].snippet.title,
                  playlistId: json2.items[k].snippet.playlistId}
                );
              }
              
              /* console.log(json.nextPageToken);
              nextToken = json.nextPageToken;
              console.log("here" + nextToken); */
              
              nextToken = json2.nextPageToken;
              console.log("pageToken = " + nextToken);
              newUrl = url + "&pageToken=" + nextToken;;
            })

            }, j * 2000);
          }(j));

          
          
        }
    }


    else {
      console.log("pages <= 1");
      db = [];
      for(let k = 0; k < json.items.length; k++)
      {
        if(json.items[k].snippet.title !== "Private video")
          db.push( 
                    {id: json.items[k].contentDetails.videoId,
                    title: json.items[k].snippet.title,
                    playlistId: json.items[k].snippet.playlistId}
                  );
      }
    }
    


    });

    setTimeout(()=>this.setState({
      vids: db
    }), 2000);
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
