let store = {
  user: { name: "Najoud" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod } = state;

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Here is Mars!</h3>
                <p>Let's take a look inside this peculiar planet.</p>
                <p>
                    Mars is the fourth planet from the Sun – a dusty, cold, desert world 
                    with a very thin atmosphere. Mars is also a dynamic planet with seasons, 
                    polar ice caps, canyons, extinct volcanoes, and evidence that it was 
                    even more active in the past.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = async (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(await apod.date);
  console.log(apod);
  if (apod.image) console.log("yay");
  else console.log("am i coming in here??");
  if (!apod || apod.date != today.getDate()) {
    console.log("OR HERE???S//s");
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async (state) => {
  let { apod, rovers } = state;

  await fetch(`http://localhost:3000/${rovers[0]}`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  //   return data;
};

// Launch Date
// Landing Date
// Status
// Most recently available photos
// Date the most recent photos were taken
