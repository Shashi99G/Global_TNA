require("dotenv").config();
const mongoose = require("mongoose");
const JobRequest = require("./models/JobRequest");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/globaltna";

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent fix",
    description:
      "My kitchen tap has been dripping constantly for two weeks. Water is pooling under the sink and I suspect there may be a pipe issue too.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Sarah Mitchell",
    contactEmail: "sarah.mitchell@example.com",
    status: "Open",
  },
  {
    title: "Bathroom ceiling light not working",
    description:
      "Replaced the bulb twice but the ceiling light still won't turn on. The switch clicks but nothing happens. Could be a wiring fault.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "James Thornton",
    contactEmail: "j.thornton@example.com",
    status: "Open",
  },
  {
    title: "Full interior repaint — 3-bed semi",
    description:
      "Looking for a painter to repaint all internal walls and ceilings across a 3-bedroom semi-detached house. Neutral tones preferred.",
    category: "Painting",
    location: "Manchester",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@example.com",
    status: "In Progress",
  },
  {
    title: "Garden fence panels need replacing",
    description:
      "Three panels of my back garden fence were damaged in the storm last month. Need a joiner to supply and fit replacement panels.",
    category: "Joinery",
    location: "Leeds",
    contactName: "Tom Bannister",
    contactEmail: "tombannister@example.com",
    status: "Open",
  },
  {
    title: "Boiler pressure keeps dropping",
    description:
      "The central heating boiler loses pressure every few days and I have to re-pressurise it manually. Think there may be a small leak.",
    category: "Plumbing",
    location: "Birmingham",
    contactName: "Carol Freeman",
    contactEmail: "carol.freeman@example.com",
    status: "Open",
  },
  {
    title: "Outdoor socket installation for garden office",
    description:
      "I have a small garden office and need a weatherproof outdoor socket fitted on the exterior wall of my house.",
    category: "Electrical",
    location: "Bristol",
    contactName: "Daniel Okafor",
    contactEmail: "d.okafor@example.com",
    status: "Closed",
  },
  {
    title: "Skirting boards and door frames painted",
    description:
      "All skirting boards and door frames throughout a two-bedroom flat need a fresh coat of gloss white paint.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Fiona Campbell",
    contactEmail: "fiona.c@example.com",
    status: "Open",
  },
  {
    title: "Wardrobe doors coming off hinges",
    description:
      "Two wardrobe doors in the master bedroom have dropped and will not close properly. Would like someone to adjust or replace the hinges.",
    category: "Joinery",
    location: "Liverpool",
    contactName: "Mark Griffiths",
    contactEmail: "mark.g@example.com",
    status: "Open",
  },
  {
    title: "Shower pump making loud noise",
    description:
      "The shower pump in the en-suite has started making a loud vibrating noise whenever the shower is on. Shower still works.",
    category: "Plumbing",
    location: "Edinburgh",
    contactName: "Anna Kowalski",
    contactEmail: "anna.k@example.com",
    status: "In Progress",
  },
  {
    title: "Consumer unit upgrade needed",
    description:
      "My house still has an old fuse board. Would like it upgraded to a modern consumer unit with RCDs and a full inspection.",
    category: "Electrical",
    location: "Sheffield",
    contactName: "Robert Hayes",
    contactEmail: "rob.hayes@example.com",
    status: "Open",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    await JobRequest.deleteMany({});
    console.log("Cleared existing jobs");
    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`Seeded ${inserted.length} jobs`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Done");
  }
}

seed();
