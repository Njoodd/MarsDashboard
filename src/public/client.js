
// Our Immutable objects holding the session and manifest information
let session = {
  selectedRover: -1,
  galleryIndex: 0,
  roverResponse: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

let missionManifests = {
  sol: -1,
  earth_date: "",
  total_photos: 0,
  cameras: [],
}

// The root element where we will add our markup
const root = document.getElementById("root");

// Generates markup from infomation received from the backend
const generateRoverCard = (state) => {
  console.log("generateRoverCard");

  let { roverResponse, galleryIndex } = state;
  console.log(roverResponse);
  console.log(roverResponse.image.photos[galleryIndex]);

  return `
    <div id="rover">
    <p>
    Launch Date: ${roverResponse.image.photos[0].rover.launch_date} <br>
    Landing Date: ${roverResponse.image.photos[0].rover.landing_date} <br>
    Status: ${roverResponse.image.photos[0].rover.status} <br>
    </p>
    </div>
    <div id="gallerywrapper">
        <div id="gallery">
            <div id="pic1">
            <img src="${roverResponse.image.photos[galleryIndex].img_src}"/>
            <br>
            <button class="previous" onclick="previousImage()">previous</button>
            <button class="next" onclick="nextImage()">next</button>
            <h3>Camera name: ${roverResponse.image.photos[galleryIndex].camera.full_name}</h3>
            <p>Date taken: ${roverResponse.image.photos[galleryIndex].earth_date}</p>
            </div>
        </div>
    </div>
        `;
};

// Function to view previous image
const previousImage = () => {
  console.log("previousImage");

  let { galleryIndex, roverResponse } = session;
  if (galleryIndex == 0)
    updateSession(session, { galleryIndex: roverResponse.image.photos.length - 1 });
  else updateSession(session, { galleryIndex: galleryIndex - 1 });
};

// Function to view next image
const nextImage = () => {
  console.log("nextImage");

  let { galleryIndex, roverResponse } = session;
  if (galleryIndex == roverResponse.image.photos.length - 1)
    updateSession(session, { galleryIndex: 0 });
  else updateSession(session, { galleryIndex: galleryIndex + 1 });
};


// Rover API call
const getRoverDetails = (session, roverIndex, getRoverDetailsResponse) => {
  console.log("getRoverDetails");

  let { rovers } = session;
  let {sol} = missionManifests;
  return getRoverDetailsResponse(`http://localhost:3000/${rovers[roverIndex]}/${sol}`, updateSessionStore);

};

// Mission Manifests API call
const getMissionManifests = (rover, getMissionManifestsResponse) => {
  console.log("getMissionManifests");

  return getMissionManifestsResponse(`http://localhost:3000/manifest/${rover}`, updateMissionManifests);
}

// Generic high order function used to retrieve data from multiple API requests and update the required objects
const getAPIResponse = async (url, updateObject) => {
  console.log("getAPIResponse");

  return await fetch(url).then(
      (res) => res.json()
    ).then(
      (jsonResponse) => updateObject(jsonResponse)
    );

};

// Assigns the rover API response to the session store
const updateSessionStore = (roversJSON) => {
  console.log("updateSessionStore");

  let {rovers} = session;
  let roverName = roversJSON.image.photos[0].rover.name 

  let index = rovers.indexOf(roverName);

  updateSession(session, 
    { roverResponse: roversJSON,
      selectedRover: index,
      galleryIndex: 0 });

  // session = Object.assign(session, 
  //   { roverResponse: roversJSON,
  //     selectedRover: index,
  //     galleryIndex: 0 });
  // render(root, session);
};

// Assigns the mission manifests API response to the missionManifests store
const updateMissionManifests = (json) => {
  console.log("updatemissionManifests");

  let maxIndex = json.response.photo_manifest.photos.length-1;
  if(json){
    missionManifests = Object.assign(missionManifests, {
      sol: json.response.photo_manifest.max_sol,
      earth_date: json.response.photo_manifest.photos[maxIndex].earth_date,
      total_photos: json.response.photo_manifest.photos[maxIndex].total_photos,
      cameras: json.response.photo_manifest.photos[maxIndex].cameras,
    });
    return true;
  }
  else return false;

};

// Assigns the rover card to the page
const buildRoverCard = (state) => {
  console.log("buildRoverCard");

  let {rovers, selectedRover} = state;
  let roverCard = document.querySelector("div#" + rovers[selectedRover])
    .querySelector("div#card");
  roverCard.innerHTML = generateRoverCard(state);  
}

// Triggered upon switching rover tabs
const openRover = async (evt, rover) => {
  console.log("openRover");

  let state = session;
  let i, tabcontent, tablinks;
  let loadingLabel;
  let roverIndex;
  tabcontent = document.getElementsByClassName("tabcontent");
  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tabcontent.length; i++) {
    if (tabcontent[i].id !== rover) tabcontent[i].style.display = "none";
    else roverIndex = i;
  }

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  evt.currentTarget.className += " active";
  tabcontent[roverIndex].style.display = "block";
  loadingLabel = document
    .querySelector("div#" + rover)
    .querySelector("div#card");
  loadingLabel.innerHTML = "<h3> Loading.. </h3>";

  
  let changed = await getMissionManifests(rover, getAPIResponse)
  if(changed)
    getRoverDetails(state, roverIndex, getAPIResponse)
};

// Creates default content
const App = () => {
  console.log("App");

      return `
        <header></header>
        <main>
            <h2>Hello!</h2>
            <section>
                <h2>Welcome to Mars :)</h2>
                <p>
                Since the 1970s, scientists have been sending spacecraft to Mars.
                Several different types of spacecraft have been sent to the Red
                Planet over the years, and they all have different specialties.
                One of these spacecrafts are called Rovers. Rovers have wheels and
                specialize in moving around. They land on the surface of Mars and
                drive around to different spots.
                <br /><br />
                View pictures taken by some of the Mars Rovers below!
                </p>
                
                <div class="tab">
                <button class="tablinks" onclick="openRover(event, 'Curiosity')">
                    Curiosity
                </button>
                <button class="tablinks" onclick="openRover(event, 'Opportunity')">
                    Opportunity
                </button>
                <button class="tablinks" onclick="openRover(event, 'Spirit')">
                    Spirit
                </button>
                </div>

                <div id="Curiosity" class="tabcontent">
                <h3>Curiosity</h3>
                <p>
                    Curiosity is a rover that was sent to Mars to determine if the Red
                    Planet ever had the proper conditions for microbial life to survive.
                </p>
                <div id="card">
                </div>
                </div>

                <div id="Opportunity" class="tabcontent">
                <h3>Opportunity</h3>
                <p>
                    Spirit and Opportunity are twin rovers that were made to learn more
                    about the planet Mars.
                </p>
                <div id="card">
                </div>
                </div>

                <div id="Spirit" class="tabcontent">
                <h3>Spirit</h3>
                <p>
                    Spirit and Opportunity are twin rovers that were made to learn more
                    about the planet Mars.
                </p>
                <div id="card">
                </div>
                </div>
            </section>
        </main>
        <footer></footer>
        `;
 // }
};

// Assigns the generated markup to our root element
const render = (root, state) => {
  console.log("render");

  let {selectedRover} = state;
  if ( selectedRover == -1)
    root.innerHTML = App();
  else
    buildRoverCard(state);
  
};

// Immutable JS based function to update our immutable object (session)
const updateSession = (session, newState) => {
  console.log("updateSession");

  session = Object.assign(session, newState);
  render(root, session);
};

// A listener for load event because page should load before any JS is called
window.addEventListener("load", () => {
  console.log("Loadinggg");
  render(root, session);
});
