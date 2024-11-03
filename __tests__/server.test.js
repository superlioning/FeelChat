const request = require("supertest");
const express = require("express");
const cors = require("cors");

// Create a test Express app
let app;

describe("CORS Middleware Tests", () => {
  beforeEach(() => {
    // Setup fresh Express app for each test
    app = express();
    app.use(cors());

    // Add a test route
    app.get("/test", (req, res) => {
      res.json({ message: "test route" });
    });

    app.post("/test", (req, res) => {
      res.json({ message: "test post route" });
    });
  });

  // Test if CORS headers are present in GET requests
  test("should include CORS headers in GET response", async () => {
    const response = await request(app).get("/test").expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  // Test if CORS headers are present in POST requests
  test("should include CORS headers in POST response", async () => {
    const response = await request(app).post("/test").expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  // Test CORS preflight requests
  test("should handle OPTIONS preflight requests", async () => {
    const response = await request(app).options("/test").expect(204);

    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toBeTruthy();
  });

  // Test with custom origin
  test("should accept requests from any origin", async () => {
    const response = await request(app)
      .get("/test")
      .set("Origin", "http://example.com")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  // Test CORS headers with different HTTP methods
  test("should include CORS headers for different HTTP methods", async () => {
    const methods = ["GET", "POST", "PUT", "DELETE"];

    for (const method of methods) {
      const response = await request(app)
        .options("/test")
        .set("Access-Control-Request-Method", method)
        .expect(204);

      expect(response.headers["access-control-allow-origin"]).toBe("*");
      expect(response.headers["access-control-allow-methods"]).toContain(
        method
      );
    }
  });

  // Test if CORS handles errors correctly
  test("should maintain CORS headers even when route does not exist", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });
});
