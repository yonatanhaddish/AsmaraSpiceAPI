// Bring in the express server and create application
let express = require("express");
let app = express();

let pieRepos = require("./repos/pieRepos");

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in requesting object
app.use(express.json());

// Create GET to return a list of all pies
router.get("/", function (req, res, next) {
  // res.status(200).send(pie);
  pieRepos.get(
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// Search for a specific pie
router.get("/search", function (req, res, next) {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };
  pieRepos.search(
    searchObject,
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// Create GET by Id to return a single pie by a specific id
router.get("/:id", function (req, res, next) {
  pieRepos.getById(
    req.params.id,
    function (data) {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "Single pie retrieved",
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie ${req.params.id} could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie ${req.params.id} could not be found.`,
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

// Create a new data of pie
router.post("/", function (req, res, next) {
  pieRepos.insert(
    req.body,
    function (data) {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "New Pie Added",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// Update a specific pie by a given id
router.put("/:id", function (req, res, next) {
  pieRepos.getById(
    req.params.id,
    function (data) {
      if (data) {
        pieRepos.update(
          req.body,
          req.params.id,
          function (data) {
            res.status(200).json({
              status: 200,
              statusText: "OK",
              message: `Pie ${req.params.id} updated.`,
              data: data,
            });
          },
          function (err) {
            next(err);
          }
        );
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Pie ${req.params.id} could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `Pie ${req.params.id} could not be found.`,
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

// Configure router so all routes are prefixed with /api/v1
app.use("/api/", router);

// Create server to listen on post 5000
var server = app.listen(5000, function () {
  console.log("Node server is running on http://localhost:5000..");
});
