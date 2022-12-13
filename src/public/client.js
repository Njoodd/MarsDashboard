// Our Immutable object holding the session information
let store = {
  selectedRover: -1,
  galleryIndex: 0,
  roverResponse: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

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
  let { galleryIndex, roverResponse } = store;
  if (galleryIndex == 0)
    updateStore(store, { galleryIndex: roverResponse.image.photos.length - 1 });
  else updateStore(store, { galleryIndex: galleryIndex - 1 });
};

// Function to view next image
const nextImage = () => {
  console.log("nextImage");
  let { galleryIndex, roverResponse } = store;
  if (galleryIndex == roverResponse.image.photos.length - 1)
    updateStore(store, { galleryIndex: 0 });
  else updateStore(store, { galleryIndex: galleryIndex + 1 });
};

// Rover API call
const getRoverDetails = (roverIndex) => {
  console.log("getRoverDetails");
  let { rovers } = store;

  fetch(`http://localhost:3000/${rovers[roverIndex]}`)
    .then((res) => res.json())
    .then((jsonResponse) =>
      updateStore(store, {
        roverResponse: jsonResponse,
        selectedRover: roverIndex,
        galleryIndex: 0,
      })
    );
};

// Triggered upon switching rover tabs
const openRover = (evt, rover) => {
  console.log("openRover");

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
  getRoverDetails(roverIndex);
};

// Creates content for the Curiosity rover
const CuriosityCard = (state) => {
  console.log("CuriosityCard");

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
                    <button class="active" onclick="openRover(event, 'Curiosity')">
                        Curiosity
                    </button>
                    <button class="tablinks" onclick="openRover(event, 'Opportunity')">
                        Opportunity
                    </button>
                    <button class="tablinks" onclick="openRover(event, 'Spirit')">
                        Spirit
                    </button>
                    </div>

                    <div id="Curiosity" class="tabcontent" style="display:block">
                    <h3>Curiosity</h3>
                    <p>
                        Curiosity is a rover that was sent to Mars to determine if the Red
                        Planet ever had the proper conditions for microbial life to survive.
                    </p>
                    <div id="card">
                    ${generateRoverCard(state)}
                    </div>
                    </div>

                    <div id="Opportunity" class="tabcontent" style="display:none">
                    <h3>Opportunity</h3>
                    <p>
                        Spirit and Opportunity are twin rovers that were made to learn more
                        about the planet Mars.
                    </p>
                    <div id="card">
                    </div>
                    </div>

                    <div id="Spirit" class="tabcontent" style="display:none">
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
};

// Creates content for the Opportunity rover
const OpportunityCard = (state) => {
  console.log("OpportunityCard");

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
                    <button class="active" onclick="openRover(event, 'Opportunity')">
                        Opportunity
                    </button>
                    <button class="tablinks" onclick="openRover(event, 'Spirit')">
                        Spirit
                    </button>
                    </div>

                    <div id="Curiosity" class="tabcontent" style="display:none">
                    <h3>Curiosity</h3>
                    <p>
                        Curiosity is a rover that was sent to Mars to determine if the Red
                        Planet ever had the proper conditions for microbial life to survive.
                    </p>
                    <div id="card">
                    </div>
                    </div>

                    <div id="Opportunity" class="tabcontent" style="display:block">
                    <h3>Opportunity</h3>
                    <p>
                        Spirit and Opportunity are twin rovers that were made to learn more
                        about the planet Mars.
                    </p>
                    <div id="card">
                    ${generateRoverCard(state)}
                    </div>
                    </div>

                    <div id="Spirit" class="tabcontent" style="display:none">
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
};

// Creates content for the Spirit rover
const SpiritCard = (state) => {
  console.log("SpiritCard");

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
                    <button class="active" onclick="openRover(event, 'Spirit')">
                        Spirit
                    </button>
                    </div>

                    <div id="Curiosity" class="tabcontent" style="display:none">
                    <h3>Curiosity</h3>
                    <p>
                        Curiosity is a rover that was sent to Mars to determine if the Red
                        Planet ever had the proper conditions for microbial life to survive.
                    </p>
                    <div id="card">
                    </div>
                    </div>

                    <div id="Opportunity" class="tabcontent" style="display:none">
                    <h3>Opportunity</h3>
                    <p>
                        Spirit and Opportunity are twin rovers that were made to learn more
                        about the planet Mars.
                    </p>
                    <div id="card">
                    </div>
                    </div>

                    <div id="Spirit" class="tabcontent" style="display:block">
                    <h3>Spirit</h3>
                    <p>
                        Spirit and Opportunity are twin rovers that were made to learn more
                        about the planet Mars.
                    </p>
                    <div id="card">
                    ${generateRoverCard(state)}
                    </div>
                    </div>
                </section>
            </main>
            <footer></footer>
        `;
};

// Creates default content
const App = (state) => {
  console.log("App");

  let { selectedRover } = state;
  switch (selectedRover) {
    case 0:
      return CuriosityCard(state);
    case 1:
      return OpportunityCard(state);
    case 2:
      return SpiritCard(state);
    default:
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
  }
};

// Assigns the generated markup to our root element
const render = (root, state) => {
  console.log("render");
  root.innerHTML = App(state);
};

// Immutable JS based function to update our immutable object (Store)
const updateStore = (store, newState) => {
  console.log("updateStore");

  store = Object.assign(store, newState);
  render(root, store);
};

// A listener for load event because page should load before any JS is called
window.addEventListener("load", () => {
  console.log("Loadinggg");
  render(root, store);
});
