const cluster = require("cluster");
const os = require("os");
const chalk = require("chalk");
const mongoose = require("mongoose");

const numCPU = os.cpus().length;

function serverScaleWithClusterProcess(app) {
  //cluster.worker.kill();
  console.log("total CPU", numCPU);
  if (cluster.isMaster) {
    for (let i = 0; i < numCPU; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    // app.listen(3000, () => console.log("server running" + process.pid));

    //connected express with port
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(
        chalk.green.inverse(
          `Server is running by process ${process.pid} on PORT ${PORT}`
        )
      );
    });
  }
}

function serverConnect(app) {
  //connected express with port

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(chalk.green.inverse(`Server is running on PORT ${PORT}`));
  });
}

function connectWithLocalDB(app) {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "rbacDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("LOCAL mongodb connected.");

      serverConnect(app);

      //serverScaleWithClusterProcess(app);
    })
    .catch((err) => console.log(err.message));
}

function connectWithCloudDB(app) {
  mongoose
    .connect(process.env.CLOUD_MONGODB_URI, {
      dbName: "pineApple",
      user: "shamim",
      pass: "imshamim123",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("CLOUD mongodb connected.");

      //connected express with port

      // const PORT = process.env.PORT || 8080;
      // app.listen(PORT, () => {
      //   console.log(chalk.green.inverse(`Server is running on PORT ${PORT}`));
      // });

      //serverConnect(app);

      serverScaleWithClusterProcess(app);
    })
    .catch((err) => console.log(err.message));
}

module.exports = (app) => {
  //connectWithLocalDB(app);
  connectWithCloudDB(app);

  //call back before connection established.
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db");
  });

  //call back for any time error on mongo connection.
  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  //callback for disconnected
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected.");
  });

  //properly closed mongo connection
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};
