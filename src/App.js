import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import "./App.css";
import Particles from "react-particles-js";

const particlesOptions = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: [{}],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (userData) => {
    this.setState({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        entries: userData.entries,
        joined: userData.joined,
      },
    });
  };

  // componentDidMount() {
  //   fetch("http://localhost:8000/")
  //     .then((res) => res.json())
  //     .then(console.log);
  // }

  calculateFaceLocation = (data) => {
    // console.log(data);
    const faceLocationArrays = data.outputs[0].data.regions.map(
      (dataCoor, i) => {
        console.log(dataCoor);
        const clarifaiFace = dataCoor.region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        return this.displayFaceBox({
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        });
      }
    );
    return faceLocationArrays;
  };

  displayFaceBox = (newBox) => {
    console.log(newBox);
    this.setState({ box: [...this.state.box, newBox] });
    console.log(this.state.box.length);
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    // console.log(this.state.input);
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    console.log(this.state.imageUrl);
    fetch("https://cryptic-anchorage-82359.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          fetch("https://cryptic-anchorage-82359.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
              // console.log(this.state.user.entries);
            });
        }
        // const faceLocationArrays = res.outputs[0].data.regions.map((data, i) => {

        // })
        // this.displayFaceBox(this.calculateFaceLocation(res)).catch((err) =>
        //   console.log(err)
        // );
        this.calculateFaceLocation(res);
      });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
              box={this.state.box}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />{" "}
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
