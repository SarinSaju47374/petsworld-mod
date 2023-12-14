 
const sideMenu  = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closedBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const sideBarOptions = document.querySelectorAll(".sidebar a");
const sideBar = document.querySelector(".sidebar");

// Show Sidebar
menuBtn.addEventListener("click",()=>{
    sideMenu.style.display="block";
})


// Close Sidebar
closedBtn.addEventListener("click",()=>{
    sideMenu.style.display="none";
})

//Change Theme

themeToggler.addEventListener("click",()=>{
    document.body.classList.toggle("dark-theme-variables");

    themeToggler.querySelector("i:nth-child(1)").classList.toggle("active");
    themeToggler.querySelector("i:nth-child(2)").classList.toggle("active");
})

// ACTIVE CLASS MANAGEMENT
sideBarOptions.forEach(a=>{
     a.addEventListener("click",()=>{
        sideBarOptions.forEach(elem=>{
            elem.classList.remove("active");
        })
        a.classList.add("active");
     })
})
 


// ACTIVE CLASS MANAGEMENT

// UPLOAD FILE SCRIPT UI
function updateFileLabelText(input) {
    const fileCount = input.files.length;
    const fileLabelText = fileCount === 1 ? '1 file selected' : `${fileCount} files selected`;
    const label = input.parentNode;
    label.textContent = fileLabelText;
    label.appendChild(input);
}
// UPLOAD FILE SCRIPT UI



