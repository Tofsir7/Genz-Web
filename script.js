// console.log("Hello, World!", document);
// const fs = require("fs");
// const tempCourse = fs.readFileSync(path.join(__dirname, "Templates/Template-course.html"), "utf8");
const element = document
  .querySelector("#course-search-button")
  .addEventListener("click", async function () {
    const query = document.getElementById("searchInput").value;
    console.log("Search query:", query);
    if (!query.trim()) return;
    // // Send search query to backend
    const response = await fetch("/search-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    
    //alert(JSON.stringify(data));
  });
