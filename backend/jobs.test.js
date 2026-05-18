const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server");
const JobRequest = require("./models/JobRequest");

const MONGO_URI =
  process.env.MONGO_URI_TEST || "mongodb://localhost:27017/globaltna_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/jobs", () => {
  it("returns empty list when no jobs exist", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("returns all jobs", async () => {
    await JobRequest.create([
      { title: "Fix tap", description: "Tap leaking", category: "Plumbing" },
      { title: "Paint hall", description: "Hallway paint", category: "Painting" },
    ]);
    const res = await request(app).get("/api/jobs");
    expect(res.body.count).toBe(2);
  });

  it("filters by category", async () => {
    await JobRequest.create([
      { title: "Fix tap", description: "Tap leaking", category: "Plumbing" },
      { title: "Paint hall", description: "Hallway paint", category: "Painting" },
    ]);
    const res = await request(app).get("/api/jobs?category=Plumbing");
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].category).toBe("Plumbing");
  });

  it("filters by status", async () => {
    await JobRequest.create([
      { title: "Open job", description: "Open desc", status: "Open" },
      { title: "Closed job", description: "Closed desc", status: "Closed" },
    ]);
    const res = await request(app).get("/api/jobs?status=Closed");
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].status).toBe("Closed");
  });
});

describe("GET /api/jobs/:id", () => {
  it("returns a single job", async () => {
    const job = await JobRequest.create({
      title: "Fix socket",
      description: "Socket sparking",
      category: "Electrical",
    });
    const res = await request(app).get(`/api/jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Fix socket");
  });

  it("returns 404 for non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/jobs", () => {
  it("creates a new job", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Replace fence",
      description: "Three panels damaged",
      category: "Joinery",
      location: "Leeds",
      contactEmail: "tom@example.com",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("Open");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ description: "No title" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when description is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ title: "Fix boiler" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Fix boiler",
      description: "Pressure dropping",
      contactEmail: "not-an-email",
    });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/jobs/:id", () => {
  it("updates status", async () => {
    const job = await JobRequest.create({
      title: "Paint bedroom",
      description: "Needs repainting",
    });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "In Progress" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("In Progress");
  });

  it("returns 400 for invalid status", async () => {
    const job = await JobRequest.create({
      title: "Paint bedroom",
      description: "Needs repainting",
    });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "Done" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: "Closed" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/jobs/:id", () => {
  it("deletes a job", async () => {
    const job = await JobRequest.create({
      title: "Fix boiler",
      description: "Pressure dropping",
    });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.status).toBe(200);
    const gone = await JobRequest.findById(job._id);
    expect(gone).toBeNull();
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
