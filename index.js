// code away!
const server = require("./server");

server.listen(process.env.PORT || 4000, (req, res) => {
  console.log("sever running on port 4000");
});
