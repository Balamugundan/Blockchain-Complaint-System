// ===================== REGISTER =====================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event){

        event.preventDefault();

        const user = {

            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value

        };

        const response = await fetch("http://localhost:5000/register",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(user)

        });

        const data = await response.text();

        alert(data);

        registerForm.reset();

    });

}

// ===================== LOGIN =====================

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit",async function(event){

        event.preventDefault();

        const loginData={

            email:document.getElementById("loginEmail").value,
            password:document.getElementById("loginPassword").value

        };

        const response=await fetch("http://localhost:5000/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(loginData)

        });

        const result=await response.text();

        alert(result);

        if(result==="Login Successful"){

    localStorage.setItem("userEmail", loginData.email);

    window.location.href="dashboard.html";

}

    });

}
// ===================== COMPLAINT =====================

const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {

    complaintForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const complaint = {

    userEmail: localStorage.getItem("userEmail"),

    title: document.getElementById("title").value,

    department: document.getElementById("department").value,

    description: document.getElementById("description").value

};

        const response = await fetch("http://localhost:5000/complaint", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(complaint)

        });

        const result = await response.text();

        alert(result);

        complaintForm.reset();

    });

}
// ================= DASHBOARD =================

const complaintTable = document.getElementById("complaintTable");

if (complaintTable) {

    loadComplaints();

}

async function loadComplaints() {

    const response = await fetch("http://localhost:5000/complaints");

    const complaints = await response.json();

    complaintTable.innerHTML = "";

    complaints.forEach(function(c){

        complaintTable.innerHTML += `

        <tr>

            <td>${c.title}</td>
            <td>${c.department}</td>
            <td>${c.description}</td>
            <td>${c.status}</td>
            <td>${new Date(c.date).toLocaleString()}</td>

        </tr>

        `;

    });

}
// ================= ADMIN DASHBOARD =================

const adminTable = document.getElementById("adminTable");

if(adminTable){

    loadAdminComplaints();

}

async function loadAdminComplaints(){

    const response = await fetch("http://localhost:5000/complaints");

    const complaints = await response.json();

    adminTable.innerHTML = "";

    complaints.forEach(c=>{

        adminTable.innerHTML += `

        <tr>

            <td>${c.title}</td>

            <td>${c.department}</td>

            <td>${c.description}</td>

            <td>

                <select onchange="updateStatus('${c._id}',this.value)">

                    <option value="Pending" ${c.status=="Pending"?"selected":""}>Pending</option>

                    <option value="In Progress" ${c.status=="In Progress"?"selected":""}>In Progress</option>

                    <option value="Resolved" ${c.status=="Resolved"?"selected":""}>Resolved</option>

                    <option value="Rejected" ${c.status=="Rejected"?"selected":""}>Rejected</option>

                </select>

            </td>

            <td>${new Date(c.date).toLocaleString()}</td>

        </tr>

        `;

    });

}

async function updateStatus(id,status){

    const response = await fetch(`http://localhost:5000/complaint/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            status:status

        })

    });

    const result = await response.text();

    alert(result);

}