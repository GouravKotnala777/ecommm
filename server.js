const app = require("./app");
const PORT = 8000;


app.get("/", (req, res) => {
    res.json({m:"hallllo"})
})





app.listen(PORT, () => {
    console.log("listening....");
});